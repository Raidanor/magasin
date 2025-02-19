import { redis }  from "../lib/redis.js"
import cloudinary from "../lib/cloudinary.js"

import Product from "../models/product.model.js"



export const getAllProducts = async (req, res) => {
    try {
        const products = await Product .find({})
        res.json({ products})
    } catch (error) {
        console.log("Error in getAllProducts function")
        res.status(401).json({message: error.message})
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
    try {
        const { name, description, price, image, category } = req.body

        let cloudinaryResponse = null

        if (image)
        {
            cloudinaryResponse = await cloudinary.uploader.upload(image, {folder:"products"})
        }

        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category
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
                sample: {size:3},
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
