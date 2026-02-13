import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import axios from "axios"

const base = "https://api-m.sandbox.paypal.com"; 
// Change to https://api-m.paypal.com for production

// import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

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
            })),
            payment_type,
            totalAmount: m_total
            // stripeSessionId: sessionId,
        });

        await newOrder.save();
        // sendEmail(newOrder)

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
        console.log(total)

        console.log("createOrderPaypal is running")
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
        console.log(order.data.id)
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
            })),
            payment_type: "paypal",
            totalAmount: total,
            paypalOrderId: orderID,
        });

        await newOrder.save();

        // sendEmail(newOrder)

        res.json(capture.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).send("Error capturing order");
    }
}

// Generate Access Token for Paypal checkout
async function generateAccessToken() {
    console.log("generateAccessToken is running")

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
// async function sendEmail(order) {

//     console.log("sending email")

//     const jasbeen = "jasbeen@the-best-choice.store"

//     const user = await User.findById(order.user._id)

//     const mailerSend = new MailerSend({
//         apiKey: process.env.MAILERSEND_API_KEY,
//     });
      
//     const sentFrom = new Sender(jasbeen, "Jasbeen");
    
//     const recipients = [
//         new Recipient(user.email, user.name)
//     ];
    
//     // const cc = [
//     //     new Recipient(jasbeen, "Jasbeen")
//     // ];

//     const bcc = [
//         new Recipient("ismethkhadaroo@gmail.com", "Ismeth"),
//     ];
    
//     let personalization = {}

//     let emailParams = new EmailParams()
//     .setFrom(sentFrom)
//     .setTo(recipients)
//     .setReplyTo(sentFrom)
//     // .setCc(cc)
//     .setBcc(bcc)
//     .setSubject("Order Confirmation for " + user.name)

//     switch (order.payment_type)
//     {
//         case "cash_on_delivery":
//             personalization = [{
//                 email: user.email,
//                 data: {
//                     address: user.address,
//                     total: order.totalAmount
//                 },
//             }];

//             emailParams
//             .setTemplateId("351ndgwkzjrgzqx8")
//             .setPersonalization(personalization)

//         break

//         case "online":
//             personalization = [{
//                 email: user.email,
//                 data: {
//                     address: user.address,
//                     total: order.totalAmount
//                 },
//             }];

//             emailParams
//             .setTemplateId("351ndgwkzjrgzqx8")
//             .setPersonalization(personalization)

//         break
        
//         case "pickup":
//             personalization = [{
//                 email: user.email,
//                 data: {
//                     pickup_address: "101 La Paix Street, Port-Louis",
//                     total: order.totalAmount
//                 },
//             }];
        
//             emailParams
//             .setTemplateId("neqvygm1rqzg0p7w")
//             .setPersonalization(personalization)
//         break

//     }
    
//     await mailerSend.email
//     .send(emailParams)
//     .then((response) => console.log(response))
//     .catch((error) => console.log(error));

//     sendOrderDetails(order)
// }
// async function sendOrderDetails(order) {

//     const jasbeen = "jasbeen@the-best-choice.store"
//     const user = await User.findById(order.user._id)

//     const mailerSend = new MailerSend({
//         apiKey: process.env.MAILERSEND_API_KEY,
//     });
    
//     const sentFrom = new Sender(jasbeen, "Jasbeen");
    
//     const recipients = [
//         new Recipient("ismethkhadaroo@gmail.com", "Ismeth"),
//     ];
    
//     const personalization = [{
//         email: "ismethkhadaroo@gmail.com",
//         data: {
//             name: user.name,
//             address: user.address,
//             phoneNumber: user.phoneNumber,

//             id: order._id,
//             total: order.totalAmount,
//             products: order.products,
//             createdAt: new Date(order.createdAt).toLocaleString('en-GB', { 
//                 day:'numeric', 
//                 month: 'long', 
//                 year:'numeric', 
//                 hour:"2-digit", 
//                 minute: "2-digit", 
//                 second:"2-digit", 
//                 timeZone: 'Etc/GMT-4', 
//                 timeZoneName: 'short'
//             }),
//             payment_type: order.payment_type,

//         },
//     }];

//     const emailParams = new EmailParams()
//     .setFrom(sentFrom)
//     .setTo(recipients)
//     .setReplyTo(sentFrom)
//     .setSubject("Order Details for " + user.name + ". Date: " + order.createdAt)
//     .setTemplateId("neqvygm1ko5g0p7w")
//     .setPersonalization(personalization)

//     await mailerSend.email
//     .send(emailParams)
//     .then((response) => console.log(response))
//     .catch((error) => console.log(error))
// }