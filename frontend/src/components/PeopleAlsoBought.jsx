import { useEffect, useState } from "react"

import ProductCard from "../components/ProductCard"
import LoadingSpinner from "../components/LoadingSpinner"

import axios from "axios"
import toast from "react-hot-toast"

const PeopleAlsoBought = () => {


    // Classic use of fetching data
    const [recommendations, setRecommendations] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchRecommendations = async() => {
            try {
                const res = await axios.get("/products/recommendations")
                setRecommendations(res.data)
            } catch (error) {
                toast.error(error.response.message.data)
            } finally {
                setIsLoading(false)
            }
        }
        fetchRecommendations()
    }, [])

    if (isLoading) return <LoadingSpinner />
    return (
        <div className='mt-8'>
            <h3 className='text-2xl font-semibold text-emerald-400'>
                People also bought
            </h3>
            <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {recommendations.map(product => (
                    <ProductCard hey={product._id} product={product} />
                ))}
            </div>
        </div>
    )
}


<div className='mt-8'>className='text-2xl font-semibold text-emerald-400'export default Peo
    People also bought
    </div>