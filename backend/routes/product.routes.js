import express from "express"
import { getAllProducts, getFeaturedProducts, createProduct, deleteProduct, getRecommendedProducts,
        getProductsByCategory, toggleFeaturedProduct, editProduct, getOneProduct } 
    from "../controllers/product.controller.js"
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.get("/", protectRoute, adminRoute,  getAllProducts)
router.get("/get/:id", protectRoute, adminRoute,  getOneProduct)
router.get("/featured", getFeaturedProducts)
router.get("/recommedations", getRecommendedProducts)
router.get("/category/:category", getProductsByCategory)

router.delete("/:id", protectRoute, adminRoute, deleteProduct)

router.post("/", protectRoute, adminRoute, createProduct)
router.post("/edit/:id", protectRoute, adminRoute, editProduct)

router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct)


export default router