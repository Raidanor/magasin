import express from "express"
import { getCartProducts, addToCart, removeAllFromCart, updateQuantity, getPastOrders, clearCart } from "../controllers/cart.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"


const router = express.Router()

router.get("/", protectRoute, getCartProducts)
router.get("/past-orders", protectRoute, getPastOrders)
router.post("/", protectRoute, addToCart)
router.delete("/", protectRoute, removeAllFromCart)
router.delete("/clear", protectRoute, clearCart)
router.put("/:id", protectRoute, updateQuantity)


export default router