import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { createCheckoutSession, checkoutSuccess, payCash } from "../controllers/payment.controller.js"

const router = express.Router()
router.post("/create-checkout-session", protectRoute, createCheckoutSession)
router.post("/checkout-success", protectRoute, checkoutSuccess)
router.post("/pay-cash", protectRoute, payCash)


export default router