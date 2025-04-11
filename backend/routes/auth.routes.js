import express from "express"
import {login, logout, signup, refreshToken, getProfile, getAllUsers} from "../controllers/auth.controller.js"
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js"


const router = express.Router()
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.post("/refresh-token", refreshToken)
router.get("/profile", protectRoute, getProfile)
router.get("/all-profiles", protectRoute, adminRoute, getAllUsers)

export default router