import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import { useCartStore } from "../stores/useCartStore";
import { PayPalButtons } from "@paypal/react-paypal-js";

export default function Checkout() {
    const { total, cart, clearCart, removeFromCart } = useCartStore()

    const navigate = useNavigate()

    return (
        <PayPalButtons
            createOrder={ async() => {
                const res = await axios.post("payments/paypal/create-order-paypal", {total})
                const data = await res.data;

                return data.orderID;
            }}
            onApprove={ async(data) => {
                const response = await axios.post("payments/paypal/capture-order-paypal", {
                    orderID: data.orderID,
                    total: total,
                    products: cart,
                })
                
                alert("Payment Successful!");
                removeFromCart(cart)
                clearCart()
                navigate("/purchase-success/" + response.data.orderId )
            }}
        />
    );
}
