import toast from "react-hot-toast";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useProductStore } from '../stores/useProductStore';
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const ProductPage = () => {
    const { oneProduct: product, getOneProduct } = useProductStore();

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

    return (
        
        <div className="container mx-auto">
            <div className='flex relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg mb-4 mx-2'>

            <div className="flex md:h-150 h-120 overflow-hidden rounded-lg border-gray-700 shadow-lg mb-4 mx-auto">
                <div className="mx-3 mt-3 flex overflow-hidden rounded-xl">
                    {product?.images ? 
                        <img
                        src={product?.images[currentIndex]}
                        className="object-cover mx-auto rounded-xl"
                        /> : 
                        <></>
                    }
                </div>
                {product?.images?.length > 1 &&
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute top-1/3 left-2 transform -translate-y-2/3 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute top-1/3 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700"
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
                }
            </div>
  

            <div className='mt-4 px-5 pb-5'>
                <h5 className='text-3xl font-semibold tracking-tight text-white'>{product.name}</h5>
                <div className='mt-5 mb-5 flex items-center justify-between'>
                    <p>
                        <span className='text-emerald-100'>{product?.description}</span>
                    </p>
                </div>
                <div>
                    <div className="grid grid-cols-2 md:grid-cols-3 mx-auto">
                        {product ? 
                            <>
                                {product?.info?.map((inf) => (
                                <ProductTag key={inf.size} info={inf} product={product}/>
                                ))}
                            </>:
                            <></>
                        }
                        
                        
                    </div>
                </div>
            </div>
        </div>
        </div>
        

    )
}

const ProductTag = ({info, product}) => {
    const { user } = useUserStore();
	const { addToCart } = useCartStore();

    let copiedProduct = JSON.parse(JSON.stringify(product));
    
    const handleAddToCart = () => {
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		}
        else {
			// add to cart
            copiedProduct.info = info
            
            addToCart(copiedProduct)
		}
	}

    return(
        <div className="flex-col p-3 border border-emerald-500 rounded-xl mx-2">
            <span className="flex text-xl md:text-2xl font-bold text-emerald-400 pb-2"><RenderPrice info={info} /></span>
            <button
                className='flex items-center justify-end rounded-lg bg-emerald-600 px-2.5 md:px-5 py-2.5 text-center text-sm font-medium
                text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 mx-auto mt-2'
                onClick={() => handleAddToCart()}
            >
                <ShoppingCart size={20} className='mr-2' />
                Add to cart
            </button>
        </div>
    )
}

function RenderPrice({info}){

    return(
        <div>
            <div className="flex">
                {info.slash ?
                <><s>Rs.{info.slash}</s> &nbsp;Rs.{info.price}</>
                : <>Rs.{info.price}</>}
            </div>
            <div className="font-normal text-white">{info.size}</div>
        </div>
    )
}



export default ProductPage