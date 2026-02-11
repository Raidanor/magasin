import axios from "../lib/axios";
import { PayPalButtons } from "@paypal/react-paypal-js";

export default function Checkout() {
    return (
        <PayPalButtons
            createOrder={ async () => {
                // const res= axios.post("payments/paypal/create-order-paypal", {
                    
                // })
                const response = await fetch(
                    "http://localhost:5000/api/payments/paypal/create-order-paypal",
                    { method: "POST" }
                );
                const data = await response.json();
                return data.id;
            }}
            onApprove={async (data) => {
                const response = await fetch(
                    "http://localhost:5000/api/payments/paypal/capture-order-paypal",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ orderID: data.orderID }),
                    }
                );

                const details = await response.json();
                alert("Payment Successful!");
                console.log(details);
            }}
        />
    );
}
