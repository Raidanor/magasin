import express from "express"
import { getCategories, createCategory } from "../controllers/category.controller.js"
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js"


const router = express.Router()

router.get("/", getCategories)
router.post("/", protectRoute, adminRoute, createCategory)

export default router