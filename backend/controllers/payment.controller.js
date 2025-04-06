import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js"
import { stripe } from "../lib/stripe.js";


import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let totalAmount = 0;

		const lineItems = products.map((product) => {
			const amount = Math.round(product.info.price * 100); // stripe wants u to send in the format of cents
			totalAmount += amount * product.quantity;

			return {
				price_data: {
					currency: "mur",
					product_data: {
						name: product.name,
						images: [product.image],
					},
					unit_amount: amount,
				},
				quantity: product.quantity || 1,
			};
		});

		let coupon = null;
		if (couponCode) {
			coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
			if (coupon) {
				totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
			}
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
			discounts: coupon
				? [{
				    coupon: await createStripeCoupon(coupon.discountPercentage),
                }]
				: [],
			metadata: {
				userId: req.user._id.toString(),
				couponCode: couponCode || "",
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						info: p.info,
					}))
				),
			},
		});

		if (totalAmount >= 20000) {
			await createNewCoupon(req.user._id);
		}
		res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
	} catch (error) {
		console.error("Error processing checkout:", error);
		res.status(500).json({ message: "Error processing checkout", error: error.message });
	}
};

export const checkoutSuccess = async (req, res) => {
	try {
		const { sessionId } = req.body;
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status === "paid") {
			if (session.metadata.couponCode) {
				await Coupon.findOneAndUpdate(
					{
						code: session.metadata.couponCode,
						userId: session.metadata.userId,
					},
					{
						isActive: false,
					}
				);
			}

			// create a new Order
			const products = JSON.parse(session.metadata.products);
			const newOrder = new Order({
				user: session.metadata.userId,
				products: products.map((product) => ({
					product: product.id,
					quantity: product.quantity,
					info: product.info,
				})),
				totalAmount: session.amount_total / 100, // convert from cents to dollars,
                payment_type: "stripe",
				stripeSessionId: sessionId,
			});

			await newOrder.save();
            sendEmail(newOrder)

			res.status(200).json({
				success: true,
				message: "Payment successful, order created, and coupon deactivated if used.",
				orderId: newOrder._id,
			});
		}
	} catch (error) {
		console.error("Error processing successful checkout:", error);
		res.status(500).json({ message: "Error processing successful checkout", error: error.message });
	}
};

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
                product: product._id,
                quantity: product.quantity,
                info: product.info,
            })),
            payment_type,
            totalAmount: m_total
            // stripeSessionId: sessionId,
        });

        await newOrder.save();
        sendEmail(newOrder)

        res.status(200).json({
            success: true,
            message: "Order created and coupon deactivated if used.",
            orderId: newOrder._id,
        });
		
	} catch (error) {
		console.error("Error processing successful checkout:", error);
		res.status(500).json({ message: "Error processing successful checkout", error: error.message });
	}
};

async function createStripeCoupon(discountPercentage) {
	const coupon = await stripe.coupons.create({
		percent_off: discountPercentage,
		duration: "once",
	});

	return coupon.id;
}

async function createNewCoupon(userId) {
	await Coupon.findOneAndDelete({ userId });

	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
		userId: userId,
	});

	await newCoupon.save();

	return newCoupon;
}

async function sendEmail(order) {
    var postmark = require("postmark");

    var client = new postmark.ServerClient("67f415cd-6067-43b4-bee2-988c5d901d45");

    console.log("sending email")

    const user = await User.findById(order.user._id)

    const body1 = "<strong>Congratulations on you purchase</strong>"
                + "<br />"
                + "<p>Your order is being processed. We'll be delivering at your current address, which is: </p>"
                + "<p>" + user.address + "</p>"
                + "<p>If you have any issues please send an email to jasbeen@the-best-choice.store or call 59024904/<p>"
                + ""
                    

    client.sendEmail({
        "From": "jasbeen@the-best-choice.store",
        "To": "jasbeen@the-best-choice.store",
        "Subject": "Order Confirmation from The Best Choice",
        "TextBody": "THis is a body" 
    });
}

