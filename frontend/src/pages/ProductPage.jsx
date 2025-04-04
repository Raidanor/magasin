import toast from "react-hot-toast";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useProductStore } from '../stores/useProductStore';
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const ProductPage = () => {
    const { oneProduct: product, getOneProduct } = useProductStore();
    const { user } = useUserStore();
	const { addToCart } = useCartStore();

    const { productId } = useParams()

    useEffect(() => {
        
        getOneProduct(productId)
    }, [getOneProduct, productId])


    // stuff for the image carousel
    const [currentIndex, setCurrentIndex] = useState(0);
    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    }
    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    }

    // -------------------------------------------------------------------------------------------------------------
    const handleAddToCart = (info) => {
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		}
        else {
			// add to cart
            console.log("add to cart")
            console.log(info)
		}
	}
    return (
        
        <div className="container mx-auto">
            <div className='flex relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg mb-4 mx-2'>

            <div className="flex lg:h-[60vh] md:h-[60vh] sm:h-[50vh] overflow-hidden rounded-lg border-gray-700 shadow-lg mb-4 mx-auto">
                <div className="mx-3 mt-3 flex overflow-hidden rounded-xl">
                    <img
                    src={product?.images[currentIndex]}
                    className=""
                    />
                </div>
                {product.images.length > 1 &&
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700"
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
                }
            </div>
  

            <div className='mt-4 px-5 pb-5'>
                <h5 className='text-2xl font-semibold tracking-tight text-white'>{product.name}</h5>
                <div className='mt-5 mb-2 font-medium flex items-center justify-between'>
                    <p>
                        <span className='text-emerald-100'>{product?.description}</span>
                    </p>
                </div>
                <div>
                    <div className="grid grid-cols-3 mx-auto">
                        {product?.info?.map((inf) => (
                            <ProductCard2 info={inf} />
                        ))}
                        
                    </div>
                </div>
            </div>
        </div>
        </div>
        

    )
}

const ProductCard2 = ({info}) => {
    const { user } = useUserStore();
	const { addToCart } = useCartStore();

    const handleAddToCart = (info) => {
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		}
        else {
			// add to cart
            console.log("add to cart")
            console.log(info)
		}
	}

    return(
        <div className="flex-col">
            <span className="flex text-3xl font-bold text-emerald-400 pb-2">{info.slash ?
            <><s>Rs.{info.slash}</s> &nbsp;Rs.{info.price}</>
            : <>Rs.{info.price}</>}</span>
            <button
                className='flex items-center justify-end rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
                text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
                onClick={() => handleAddToCart(info)}
            >
                <ShoppingCart size={20} className='mr-2' />
                Add to cart
            </button>
        </div>
    )
}

function RenderPrice({selected, product}){
    let price = 0

    if (selected.length > 1)
    {
        price = product?.info?.price
    }
    else{
        price = selected[0]?.price
    }
    // console.log(product.info)

    return(
        <>
            {/* Rs.{selected?.length > 1 ? product?.info?.price : selected[0]?.price} */}
            {product.info.slash ?
            <><s>Rs.{product.info.slash}</s> &nbsp;Rs.{price}</>
            : <>Rs.{price}</>}
        </>
    )
}



export default ProductPage