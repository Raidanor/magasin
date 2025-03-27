import { redis }  from "../lib/redis.js"
import cloudinary from "../lib/cloudinary.js"

import Category from "../models/category.model.js"
import Product from "../models/product.model.js"


export const getCategories = async (req, res) => {
    try {
        const cat = await Category.find({})

        res.json({ cat })
    } catch (error) {
        console.log("Error in getAllProducts function")
        res.status(500).json({message: error.message})
    }
}

export const createCategory = async (req, res) => {

    try {
        const { name, imageURL, ref } = req.body

        let cloudinaryResponse = null

        cloudinaryResponse = await cloudinary.uploader.upload(imageURL, {folder:"category"})

        const cat = await Category.create({
            name,
            imageURL: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            ref
        })

        await cat.save()

        res.status(201).json(cat)
    } catch (error) {
        console.log("Error on createCategory controller")
        res.status(500).json({ error: error.message})
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const cat = await Category.findById(req.params.id)

        if (!cat) res.status(404).json({message: "Category not found"})

        if (cat.imageURL)
        {
            const publicId = cat.imageURL.split("/").pop().split(".")[0]

            try {
                await cloudinary.uploader.destroy(`category/${publicId}`)
                console.log("deleted image from cloudinary")
            } catch (error) {
                console.log("error deleting image from cloudinary")
            }
            
        }

        await Category.findByIdAndDelete(req.params.id)

        res.json({ message: "Product deleted from database" })
    } catch (error) {
        console.log("Error in deleteProduct function", error.message)
        res.status(401).json({ error: error.message})
    }
}


export const categoryCount = async (req, res) => {
    try {
        const ref = req.params.ref
        const cat = await Product.countDocuments({category: ref})
        res.json({ cat })
    } catch (error) {
        console.log("Error in getAllProducts function")
        res.status(500).json({message: error.message})
    }
}