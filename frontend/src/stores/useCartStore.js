import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

function waitforme(millisec) {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, millisec);
    })
}

export const useCartStore = create((set, get) => ({
	cart: [],
    pastOrders: [],
	coupon: null,
	total: 0,
	subtotal: 0,
	isCouponApplied: false,

	getMyCoupon: async () => {
		try {
			const response = await axios.get("/coupons");
			set({ coupon: response.data });
		} catch (error) {
			console.error("Error fetching coupon:", error);
		}
	},
	applyCoupon: async (code) => {
		try {
			const response = await axios.post("/coupons/validate", { code });
			set({ coupon: response.data, isCouponApplied: true });
			get().calculateTotals();
			toast.success("Coupon applied successfully");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to apply coupon");
		}
	},
	removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false });
		get().calculateTotals();
		toast.success("Coupon removed");
	},
	getCartItems: async () => {
		try {
			const res = await axios.get("/cart");

			set({ cart: res.data });
			get().calculateTotals();
		} catch (error) {
			set({ cart: [] });
			toast.error(error.response.data.message || "An error occurred");
		}
	},
	clearCart: async () => {
        try {
            const res = axios.delete(`cart/clear`)

            set({ cart: [], coupon: null, total: 0, subtotal: 0 });
        } catch (error) {
            toast.error(error.response.data.message || "An error occurred");
        }

	},
	addToCart: async (product) => {
		try {
			await axios.post("/cart", { product });
			toast.success("Product added to cart");

			set((prevState) => {
				const existingItem = prevState.cart.find((item) => item?._id === product._id && item.info.size===product.info.size && item.colors===product.colors);

				const newCart = existingItem
					? prevState.cart.map((item) =>
							item.id === product._id ? { ...item, quantity: item.quantity + 1 } : item
					  )
					: [...prevState.cart, { ...product, quantity: 1 }];
				return { cart: newCart };
			});
            
			get().calculateTotals();
		} catch (error) {
			toast.error(error.response.data.message || "An error occurred");
		}
	},
	removeFromCart: async (productId) => {
		await axios.delete(`/cart`, { data: { productId } });
		set((prevState) => ({ cart: prevState.cart.filter((item) => item._id !== productId) }));
		get().calculateTotals();
	},
	updateQuantity: async (productId, quantity) => {
		if (quantity === 0) {
			get().removeFromCart(productId);
			return;
		}

		await axios.put(`/cart/${productId}`, { quantity });
		set((prevState) => ({
			cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
		}));
		get().calculateTotals();
	},
	calculateTotals: () => {
		const { cart, coupon } = get();
		const subtotal = cart.reduce((sum, item) => sum + item.info.price * item.quantity, 0);
		let total = subtotal;

		if (coupon) {
			const discount = subtotal * (coupon.discountPercentage / 100);
			total = subtotal - discount;
		}

		set({ subtotal, total });
	},

    getPastOrders: async () => {
		try {
			const res = await axios.get("/cart/past-orders");

			set({ pastOrders: res.data });
			
		} catch (error) {
			toast.error(error.response.data.message || "An error occurred");
		}
	},
}));