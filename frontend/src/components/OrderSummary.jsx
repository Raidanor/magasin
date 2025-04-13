import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight, X } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios";

import { useEffect, useState } from "react";

const stripePromise = loadStripe("pk_test_51Qv0awRhPunrIm29dMktxT76QcSP1OncMfiKlsNXyHBNksxYNWbIPxrwiDlrgf6mWDeCMpbIE0Ile5GlUUTaS90A00NQqrjH6W")

const OrderSummary = () => {
	const { total, subtotal, coupon, isCouponApplied, cart, clearCart } = useCartStore();
    
	const savings = subtotal - total;
	const formattedSubtotal = subtotal.toFixed(2);
	const formattedTotal = total.toFixed(2);
	const formattedSavings = savings.toFixed(2);

    const [isOpen, setIsOpen] = useState(false)

	const handlePayment = async () => {
		const stripe = await stripePromise;
		const res = await axios.post("/payments/create-checkout-session", {
			products: cart,
			couponCode: coupon ? coupon.code : null,
		});
        
		const session = res.data;
		const result = await stripe.redirectToCheckout({
			sessionId: session.id,
		});

        handleCheckoutSuccess(session.id)

		if (result.error) {
			console.error("Error:", result.error);
		}
	};

    const handlePayment_Cash = async (type) => {
        // console.log(cart)
        
		const res = await axios.post("/payments/pay-cash", {
			products: cart,
			couponCode: coupon ? coupon.code : null,
            payment_type: type,
            total: total
		})

        clearCart()
        window.location.href = "/purchase-success"
	}

	return (
		<motion.div
			className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<p className='text-xl font-semibold text-emerald-400'>Order summary</p>

			<div className='space-y-4'>
				<div className='space-y-2'>
					<dl className='flex items-center justify-between gap-4'>
						<dt className='text-base font-normal text-gray-300'>Original price</dt>
						<dd className='text-base font-medium text-white'>Rs.{formattedSubtotal}</dd>
					</dl>

					{savings > 0 && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'>Savings</dt>
							<dd className='text-base font-medium text-emerald-400'>-Rs.{formattedSavings}</dd>
						</dl>
					)}

					{coupon && isCouponApplied && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'>Coupon ({coupon.code})</dt>
							<dd className='text-base font-medium text-emerald-400'>-{coupon.discountPercentage}%</dd>
						</dl>
					)}
					<dl className='flex items-center justify-between gap-4 border-t border-gray-600 pt-2'>
						<dt className='text-base font-bold text-white'>Total</dt>
						<dd className='text-base font-bold text-emerald-400'>Rs.{formattedTotal}</dd>
					</dl>
				</div>

				<motion.button
					className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => {setIsOpen(true)}}
				>
					Proceed to Checkout
				</motion.button>

				<div className='flex items-center justify-center gap-2'>
					<span className='text-sm font-normal text-gray-400'>or</span>
					<Link
						to='/'
						className='inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline'
					>
						Continue Shopping
						<MoveRight size={16} />
					</Link>
				</div>
			</div>

            <Modal open={isOpen} onClose={() => {setIsOpen(false)}}>
                <button
					className='flex w-full md:w-1/2 mx-auto justify-center rounded-lg bg-emerald-600 px-5 py-2.5 my-5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handlePayment}
				>
					Online payment
				</button>

                <button
					className='flex w-full md:w-1/2 mx-auto justify-center rounded-lg bg-emerald-600 px-5 py-2.5 my-5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => handlePayment_Cash("cash_on_delivery")}
				>
					Pay cash on delivery
				</button>

                <button
					className='flex w-full md:w-1/2 mx-auto justify-center rounded-lg bg-emerald-600 px-5 py-2.5 my-5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => handlePayment_Cash("pickup")}
				>
					Self Pick-up
				</button>
            </Modal>
		</motion.div>
	)
}
export default OrderSummary;

function Modal ({ open, children, onClose }) {
    if (!open) return null

    return(
        <div className="fixed inset-0 flex justify-center items-center transition-colors 
           bg-black/60"
            onClick={onClose}
        >
            <div className={`w-7/8 md:w-3/4 lg:w-2/3 py-10 px-5 items-center bg-gray-800 rounded-xl shadow transition-all outline-1 outline-gray-400
                ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
            `}
            onClick={e => e.stopPropagation()}>
                <div className="sm:w-3/4 md:w-2/3 mx-auto border-3 mt-2 bg-red-500 rounded-2xl p-4">
                    Attention: Deliveries are only available within Port-Louis
                </div>
                <button
                    className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600"
                    onClick={onClose}
                >
                    <X />
                </button>
                Select payment option:
                {children}

                <div className="border-b-3 mt-2 bg-red-900 rounded-2xl p-4">
                    Online Payment: pay online and we'll deliver your items
                </div>
                <div className="border-b-3 mt-2 bg-blue-600 rounded-2xl p-4">
                    Pay Cash on delivery: We'll deliver to your address and you pay upon delivery. An extra fee of Rs.50 will be added
                </div>
                <div className="border-b-3 mt-2 bg-green-900 rounded-2xl p-4">Self Pick-up: You pay on pick-up</div>
            </div>
        </div>
    )
}