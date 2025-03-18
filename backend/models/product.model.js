import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        default: ""
    },
    info: [{
        price:{
            type: Number,
            min: 0,
            required: true
        },
        size:{
            type: String,
            default: ""
        }
    }],
    
    image:{
        type: String,
        required: [false, "Image is required"]
    },
    category:{
        type: String,
        required: true
    },
    isFeatured:{
        type: Boolean,
        default: false
    },
    
        
}, {timestamps: true})


const Product = mongoose.model("Product", productSchema)

export default Product