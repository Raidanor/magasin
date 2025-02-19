import express from "express"
import { getCoupon, validateCoupon } from "../controllers/cart.controller.js"
import { protectRoute } from "../middleware/auth.middleware"

const router = express.Router()

router.get("/", protectRoute, getCoupon)
router.get("/valifate", protectRoute, validateCoupon)

export default router