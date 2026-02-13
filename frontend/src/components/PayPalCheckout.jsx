import axios from "../lib/axios";
import { PayPalButtons } from "@paypal/react-paypal-js";

export default function Checkout({orderDetails}) {
    const total = orderDetails.total
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
                    total: orderDetails.total,
                    products: orderDetails.cart,
                    payment_type: "paypal"
                })

                const details = await response.json();
                
                alert("Payment Successful!");
                console.log(details);
            }}
        />
    );
}
