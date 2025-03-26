import { redis }  from "../lib/redis.js"
import cloudinary from "../lib/cloudinary.js"

import Category from "../models/category.model.js"



export const getCategories = async (req, res) => {
    try {
        const cat = await Category.find({})
        res.json({ cat })
        console.log(cat)
    } catch (error) {
        console.log("Error in getAllProducts function")
        res.status(500).json({message: error.message})
    }
}

export const createCategory = async (req, res) => {

    try {
        const { name, imageURL } = req.body

        let cloudinaryResponse = null

        // cloudinaryResponse = await cloudinary.uploader.upload(image, {folder:"category"})

        const cat = await Category.create({
            name,
            imageURL
        })

        await cat.save()

        res.status(201).json(cat)
        console.log("category created", cat)
    } catch (error) {
        console.log("Error on createCategory controller")
        res.status(500).json({ error: error.message})
    }
}