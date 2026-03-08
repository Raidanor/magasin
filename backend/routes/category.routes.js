import express from "express"
import { getCategories, createCategory, deleteCategory,
    getOneCategory, categoryCount, editCategory } from "../controllers/category.controller.js"
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js"


const router = express.Router()

router.get("/", getCategories)
router.get("/:id", getOneCategory)
router.post("/count", protectRoute, adminRoute, categoryCount)
router.post("/", protectRoute, adminRoute, createCategory)
router.post("/edit/:id", protectRoute, adminRoute, editCategory)

router.delete("/:id", protectRoute, adminRoute, deleteCategory)

export default router