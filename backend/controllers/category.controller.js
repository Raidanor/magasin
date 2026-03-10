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

        const newCategory = await Category.create({
            name,
            imageURL: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            ref
        })

        await newCategory.save()

        res.status(201).json(newCategory)
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
        const categoryArray = req.body
        const result = Object.fromEntries(
            await Promise.all(
                categoryArray.map(async item => [
                    item,
                    await Product.countDocuments({ category: item })
                ])
            )
        )
        
        res.json({ result })
    } catch (error) {
        console.log("Error in categoryCount function")
        res.status(500).json({message: error.message})
    }
}

export const editCategory = async (req, res) => {
    try {
        const oldCategory = await Category.findById(req.params.id)
        let newCategory = req.body
        
        // if new images
        if (newCategory.imageURL !== oldCategory.imageURL)
        {
            // delete image from cloudinary
            let cloudinaryResponse = null
            const publicId = oldCategory.imageURL.split("/").pop().split(".")[0]
            try {
                await cloudinary.uploader.destroy(`category/${publicId}`)
                console.log("deleted image from cloudinary")
            } catch (error) {
                console.log("error deleting image from cloudinary")
            }

            // upload image to cloudinary
            cloudinaryResponse = await cloudinary.uploader.upload(newCategory.imageURL, {folder:"category"})
            newCategory.imageURL = cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : ""
        }

        
        if (!oldCategory) res.status(404).json({message: "Category not found"})
        if (!newCategory) res.status(404).json({message: "Error editing Category"})
        newCategory = await Category.findByIdAndUpdate(req.params.id, newCategory, {new:true})

        res.json({ message: "Category updated" })
    } catch (error) {
        console.log("Error in editCategory function: ", error)
        res.status(401).json({ error: error.message})
    }
}

export const getOneCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
        res.json({ category })
    } catch (error) {
        console.log("Error in getOneCategory function")
        res.status(500).json({message: error.message})
    }
}