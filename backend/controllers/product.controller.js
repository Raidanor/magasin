import { redis }  from "../lib/redis.js"
import cloudinary from "../lib/cloudinary.js"

import Product from "../models/product.model.js"

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({})
        res.json({ products})
    } catch (error) {
        console.log("Error in getAllProducts function")
        res.status(500).json({message: error.message})
    }
}

export const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await redis.get("featured_products")

        if (featuredProducts) return res.json(JSON.parse(featuredProducts))

        // if not in redis, fetch from mongodb

        featuredProducts = await Product.find({ isFeatured:true}).lean()

        if (!featuredProducts) return res.status(404).json({ message: "No featured products found"})
        
        // store in redis for future access
        await redis.set("featured_products", JSON.stringify(featuredProducts))

        res.json(featuredProducts)
        
    } catch (error) {
        console.log("Error in getFeaturedProducts function")
        res.status(500).json({ error: error.message })
    }
}

export const createProduct = async (req, res) => {
    try {
        const { name, description, info, images, colors, category } = req.body

        const uploadedImages = await Promise.all(
            images.map(async (image) => {
                const cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" })
                return cloudinaryResponse.secure_url
            })
        )

        const product = await Product.create({
            name,
            description,
            info,
            images: uploadedImages,
            colors,
            category: category.ref
        })

        res.status(201).json(product)
    } catch (error) {
        console.log("Error on createProduct controller")
        res.status(500).json({ error: error.message})
    }
}

export const editProduct = async (req, res) => {
    try {
        // let product = await Product.findByIdAndUpdate(req.params.id, req.body, {new:true})
        const oldProduct = await Product.findById(req.params.id)
        let newProduct = req.body

        // let oldImages = oldProduct.images
        // let newImages = newProduct.images

        console.log(oldProduct)
        console.log("//////////////////////////////////////////////////")
        console.log(newProduct)

        // if images arrays are different
        if (JSON.stringify(newProduct.images) != JSON.stringify(oldProduct.images)){

            // delete image from cloudinary
            oldProduct.images.forEach(async(image) => {
                if (!image) return null
                if (image.startsWith("http")) {
                    return
                }
                const publicId = image.split("/").pop().split(".")[0]
                try {
                    await cloudinary.uploader.destroy(`products/${publicId}`)
                    console.log("deleted image from cloudinary")
                } catch (error) {
                    console.log("error deleting image from cloudinary")
                }
            })

            // upload image to cloudinary
            const uploadedImages = await Promise.all(
                newProduct.images.map(async (image) => {
                    if (image.startsWith("http")) {
                        return image
                    }
                    const cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" })
                    return cloudinaryResponse.secure_url
                })
            )

            newProduct.images = uploadedImages
        }
        if (!oldProduct) res.status(404).json({message: "Product not found"})
        if (!newProduct) res.status(404).json({message: "Error editing Product"})
        newProduct = await Product.findByIdAndUpdate(req.params.id, newProduct, {new:true})

        console.log(oldProduct)
        console.log("--------------------------------------")
        console.log(newProduct)
        res.json({ message: "Product updated" })
    } catch (error) {
        console.log("Error in editProduct function", error)
        res.status(401).json({ error: error.message})
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if (!product) res.status(404).json({message: "Product not found"})

        if (product.images)
        {
            product.images.forEach(async(image) => {
                const publicId = image.split("/").pop().split(".")[0]

                try {
                    await cloudinary.uploader.destroy(`products/${publicId}`)
                    console.log("deleted image from cloudinary")
                } catch (error) {
                    console.log("error deleting image from cloudinary")
                }
            })
        }

        await Product.findByIdAndDelete(req.params.id)

        res.json({ message: "Product deleted from database" })
    } catch (error) {
        console.log("Error in deleteProduct function")
        res.status(401).json({ error: error.message})
    }
}

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: {size:4},
            },
            {
                $project:{
                    _id: 1,
                    name: 1,
                    description: 1,
                    images: 1,
                    info: 1,
                    isLimited: 1,
                    category: 1,

                }
            }
        ])
        res.json({products})
    } catch (error) {
        console.log("Error in getRecommendedProducts function")
        res.status(401).json({ error: error.message})
    }
}

export const getProductsByCategory = async (req, res) => {
    const { category } = req.params
    try {
        const products = await Product.find({ category })
        res.json({products})
    } catch (error) {
        console.log("Error in getProductsByCategory function")
        res.status(500).json({ error: error.message})
        
    }
}

export const toggleFeaturedProduct  = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (product) { 
            product.isFeatured = !product.isFeatured 
            const updatedProduct = await product.save()
            await updateFeaturedProductsCache()
            res.json(updatedProduct)
        } else {
            res.status(404).json({ message: "Product not Found"})
        }
    } catch (error) {
        console.log("Error in toggleFeaturedProduct function")
        res.status(500).json({ error: error.message})
    }
}

export const toggleLimitedProduct  = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (product) { 
            product.isLimited = !product.isLimited 
            const updatedProduct = await product.save()
            await updateFeaturedProductsCache()
            res.json(updatedProduct)
        } else {
            res.status(404).json({ message: "Product not Found"})
        }
    } catch (error) {
        console.log("Error in toggleLimitedProduct function")
        res.status(500).json({ error: error.message})
    }
}

async function updateFeaturedProductsCache() {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean()

        await redis.set("featured_products", JSON.stringify(featuredProducts))
    } catch (error) {
        console.log("Error in updateFeaturedProductsCache function")
        res.status(401).json({ error: error.message})
    }
}

export const getOneProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.json({ product })
    } catch (error) {
        console.log("Error in getOneProduct function")
        res.status(500).json({message: error.message})
    }
}