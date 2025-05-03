import express from "express"
import { getAllProducts, getFeaturedProducts, createProduct,
        deleteProduct, getRecommendedProducts,
        getProductsByCategory, toggleFeaturedProduct,
        editProduct, getOneProduct, toggleLimitedProduct } 
    from "../controllers/product.controller.js"
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.get("/", protectRoute, adminRoute,  getAllProducts)
router.get("/get/:id", getOneProduct)
router.get("/featured", getFeaturedProducts)
router.get("/recommendations", protectRoute, getRecommendedProducts)
router.get("/category/:category", getProductsByCategory)

router.delete("/:id", protectRoute, adminRoute, deleteProduct)

router.post("/", protectRoute, adminRoute, createProduct)
router.post("/edit/:id", protectRoute, adminRoute, editProduct)

router.patch("/togglefeatured/:id", protectRoute, adminRoute, toggleFeaturedProduct)
router.patch("/togglelimited/:id", protectRoute, adminRoute, toggleLimitedProduct)


export default router