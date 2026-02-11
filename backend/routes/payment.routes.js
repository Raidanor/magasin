import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { createCheckoutSession, checkoutSuccess, payCash, 
    createOrderPaypal, captureOrderPaypal
} from "../controllers/payment.controller.js"

const router = express.Router()
router.post("/create-checkout-session", protectRoute, createCheckoutSession)
router.post("/checkout-success", protectRoute, checkoutSuccess)
router.post("/pay-cash", protectRoute, payCash)
router.post("/paypal/create-order-paypal", protectRoute, createOrderPaypal)
router.post("/paypal/capture-order-paypal", protectRoute, captureOrderPaypal)


export default router