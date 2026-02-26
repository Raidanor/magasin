import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import axios from "axios"

const base = "https://api-m.sandbox.paypal.com";
// Change to https://api-m.paypal.com for production

import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

export const payCash = async (req, res) => {
	try {
        const { products, coupon_Code, total, payment_type} = req.body
        const user = req.user
		
        if (coupon_Code) {
            await Coupon.findOneAndUpdate(
                {
                    code: coupon_Code,
                    userId: user._id,
                },
                {
                    isActive: false,
                }
            );
        }

        let m_total = total
        if (payment_type === "cash_on_delivery") m_total += 50

        // create a new Order
        const newOrder = new Order({
            user: user._id,
            products: products.map((product) => ({
                name: product.name,
                id: product._id,
                quantity: product.quantity,
                info: product.info,
                images: product.images,
                colors: product.colors
            })),
            payment_type,
            totalAmount: m_total
        });

        await newOrder.save();
        console.log(newOrder)
        sendEmailToCustomer(newOrder, user)
        sendOrderToAdmin(newOrder, user)

        res.status(200).json({
            success: true,
            message: "Order created and coupon deactivated if used.",
            orderId: newOrder._id,
        });
		
	} catch (error) {
		console.error("Error processing checkout:", error);
		res.status(500).json({ message: "Error processing checkout", error: error.message });
	}
};

export const createOrderPaypal = async(req, res) => {
    try {
        const { total } = req.body
        const accessToken = await generateAccessToken();

        const order = await axios.post(
            `${base}/v2/checkout/orders`,
            {
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "USD",
                            value: total,
                        },
                    },
                ],
            },
            {
                headers: {
                Authorization: `Bearer ${accessToken}`,
                },
            }
        )
        res.json({ orderID: order.data.id });
    } catch (err) {
        console.error(err.response?.data || err.message)
        res.status(500).send("Error creating order")
    }
}

export const captureOrderPaypal = async (req, res) => {
    try {
        const { products, coupon_Code, total, orderID} = req.body
        const user = req.user

        const accessToken = await generateAccessToken();

        const capture = await axios.post(
            `${base}/v2/checkout/orders/${orderID}/capture`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )
        // create a new Order
        const newOrder = new Order({
            user: user._id,
            products: products.map((product) => ({
                name: product.name,
                id: product._id,
                quantity: product.quantity,
                info: product.info,
                images: product.images,
                colors: product.colors
            })),
            payment_type: "paypal",
            totalAmount: total,
            paypalOrderId: orderID,
        });

        await newOrder.save();

        const captureData = capture.data
        const orderId = newOrder._id
        res.json({captureData, orderId});
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).send("Error capturing order");
    }
}

// Generate Access Token for Paypal checkout
async function generateAccessToken() {

    const auth = Buffer.from(
        process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET
    ).toString("base64");

    const response = await axios.post(
        `${base}/v1/oauth2/token`,
        "grant_type=client_credentials",
        {
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        }
    );

    return response.data.access_token;
}

// -------------------------------------------------------------------------------------
async function sendEmailToCustomer(order, user) {
    console.log("sending email to customer")

    const mailerSend = new MailerSend({apiKey: process.env.MAILERSEND_API_KEY,});

    const sentFrom = new Sender("jasbeen@the-best-choice.store", "The Best Choice");
    const recipients = [new Recipient(user.email, user.name)];

    let personalization = []
    let templateId = ""
    
    if (order.payment_type == "pickup") {
        personalization = [{
            email: user.email,
            data: {
                total: order.totalAmount,
                pickup_address: "101 La Paix Street, Port-Louis"
            },
        }];
        templateId = "neqvygm1rqzg0p7w"
    } else {
        personalization = [{
            email: user.email,
            data: {
                address: user.address,
                total: order.totalAmount
            },
        }];
        templateId = "351ndgwkzjrgzqx8"
    }
    
    let emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setBcc([new Recipient("jasbeen@the-best-choice.store")])
    .setSubject("Order Confirmation for " + user.name)
    .setTemplateId(templateId)
    .setPersonalization(personalization)

    try {
        const response = await mailerSend.email.send(emailParams)
    } catch (error) {
        console.error("Error sending email:", error);
    }
    
}

async function sendOrderToAdmin(order, user) {
    console.log("sending email to admin")

    const mailerSend = new MailerSend({apiKey: process.env.MAILERSEND_API_KEY});
    
    const sentFrom = new Sender("jasbeen@the-best-choice.store", "The Best Choice");
    const recipients = [new Recipient("ismethkhadaroo@gmail.com", "Ismeth"),];
    
    const personalization = [{
        email: "ismethkhadaroo@gmail.com",
        data: {
            name: user.name,
            address: user.address,
            phoneNumber: user.phoneNumber,

            id: order._id,
            total: order.totalAmount,
            products: order.products,
            createdAt: new Date(order.createdAt).toLocaleString('en-GB', { 
                day:'numeric', 
                month: 'long', 
                year:'numeric', 
                hour:"2-digit", 
                minute: "2-digit", 
                second:"2-digit", 
                timeZone: 'Etc/GMT-4', 
                timeZoneName: 'short'
            }),
            payment_type: order.payment_type,
        },
    }];

    const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setBcc([new Recipient("jasbeen@the-best-choice.store")])
    .setSubject("Order Details for " + user.name + ". Date: " + order.createdAt)
    .setTemplateId("neqvygm1ko5g0p7w")
    .setPersonalization(personalization)

    try {
        const response = await mailerSend.email.send(emailParams)
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

// async function createNewCoupon(userId) {
// 	await Coupon.findOneAndDelete({ userId });

// 	const newCoupon = new Coupon({
// 		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
// 		discountPercentage: 10,
// 		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
// 		userId: userId,
// 	});

// 	await newCoupon.save();

// 	return newCoupon;
// }
