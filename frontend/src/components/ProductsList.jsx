import { motion } from "framer-motion"
import { Trash, Star } from "lucide-react"
import { useProductStore } from "../stores/useProductStore"


const ProductsList = () => {
    const { deleteProduct, toggleFeaturedProduct, products } = useProductStore()


    const handleDelete = async() => {
        
    }
  return (
    <div>ProductsList</div>
  )
}

export default ProductsList