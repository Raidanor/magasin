import express from "express"
import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.get("/", protectRoute, getCoupon)
router.get("/validate", protectRoute, validateCoupon)

export default router