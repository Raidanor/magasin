import express from "express"
import { getCategories, createCategory, deleteCategory, categoryCount } from "../controllers/category.controller.js"
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js"


const router = express.Router()

router.get("/", getCategories)
router.get("/count/:ref", protectRoute, adminRoute, categoryCount)
router.post("/", protectRoute, adminRoute, createCategory)

router.delete("/:id", protectRoute, adminRoute, deleteCategory)

export default router