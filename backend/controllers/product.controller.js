import { redis }  from "../lib/redis.js"

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
    
}