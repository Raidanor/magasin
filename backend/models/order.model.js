import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		products: [
			{
                name:{
                    type: String,
                    required: true
                },
				id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					min: 1,
				},
                info:{
                    price: {
                        type: Number,
                        required: true,
                        min: 0
                    },

                    size: { type: String, default: "" }
                },
                images:[{
                    type: String,
                }],
			},
		],
		totalAmount: {
			type: Number,
			required: true,
			min: 0,
		},
        payment_type: {
            type: String,
            default: ""
        },
		paypalOrderId: {
			type: String,
			unique: true,
            sparse: true
		},
	},
	{ timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;