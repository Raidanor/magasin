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

        if (!featuredProducts) return res.dtatus(404).json({ message: "No featured products found"})
        
        // store in redis for future access
        await redis.set("featured_products", JSON.stringify(featuredProducts))

        res.json(featuredProducts)
        
    } catch (error) {
        console.log("Error in getFeaturedProducts function")
        res.status(500).json({ error: error.message })
    }
}

export const createProduct = async (req, res) => {

    function waitforme(millisec) {
        return new Promise(resolve => {
            setTimeout(() => { resolve('') }, millisec);
        })
    }

    try {
        const { name, description, info, images, category} = req.body

        let cloudinaryResponse = null

        let arr = []

        images.forEach(async(image) => {
            cloudinaryResponse = await cloudinary.uploader.upload(image, {folder:"products"})
            arr.push(cloudinaryResponse.secure_url)
        });

        // delay for code execution
        await waitforme(8000)
        const product = await Product.create({
            name,
            description,
            info,
            images: arr,
            category,
        })

        res.status(201).json(product)
    } catch (error) {
        console.log("Error on createProduct controller")
        res.status(500).json({ error: error.message})
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if (!product) res.status(404).json({message: "Product not found"})

        if (product.image)
        {
            const publicId = product.image.split("/").pop().split(".")[0]

            try {
                await cloudinary.uploader.destroy(`products/${publicId}`)
                console.log("deleted image from cloudinary")
            } catch (error) {
                console.log("error deleting image from cloudinary")
            }
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
                $sample: {size:2},
            },
            {
                $project:{
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    price: 1
                }
            }
        ])
        res.json(products)
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
        // console.log(products)
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

async function updateFeaturedProductsCache() {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean()

        await redis.set("featured_products", JSON.stringify(featuredProducts))
    } catch (error) {
        console.log("Error in updateFeaturedProductsCache function")
        res.status(401).json({ error: error.message})
    }
}
