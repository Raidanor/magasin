import toast from "react-hot-toast";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-dropdown-select"

const ProductCard = ({ product }) => {
	const { user } = useUserStore();
	const { addToCart } = useCartStore();

    const [newProduct, setNewProduct] = useState(product)

    const [s, setS] = useState("")
    const [color, setColor] = useState("")
    const [colorOptions, setColorOptions] = useState(product.colors)
    const selected = product.info

    useEffect(() => {
        let newInfo = {}
        product.info.forEach(element => {
            if (element.size === s[0]?.size) {
                newInfo = {price: element.price, size: s[0].size, slash: element.slash}
                setNewProduct({...newProduct,  info: newInfo})
            }
        });
    }, [s])

    const handleAddToCart = () => {
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		}
        else {
			// add to cart
            if (selected?.length > 1 && s === "")
            {
                toast.error("Select a size first")
            }
            else if (colorOptions?.length > 1 && color === "")
            {
                toast.error("Select a color")
            }
            else {
                if (Array.isArray(newProduct.info)) { setNewProduct({...newProduct,  info: newProduct.info[0]}) }
                addToCart(newProduct)
                console.log(newProduct)
            }
		}
	}

    useEffect(() => {
        if (Array.isArray(newProduct.info)) { setNewProduct({...newProduct,  info: newProduct.info[0]}) }
    })

    // stuff for the image carousel
    const [currentIndex, setCurrentIndex] = useState(0);
    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    }
    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    }

	return (
        <div className='flex w-full relative flex-col rounded-lg border border-gray-700 shadow-lg mb-4'>
            <div className="flex w-full relative flex-col rounded-lg  border-gray-700 shadow-lg mb-4">
                <div className="relative mx-3 mt-3 flex md:h-100 h-80 rounded-xl">
                    <img
                        src={product?.images[currentIndex]}
                        className="object-cover mx-auto rounded-xl"
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

            <div className='mt-4 px-5 pb-5 z-1'>
                {product.isLimited &&
                    <div className="absolute transform rotate-45 bg-red-600 text-center text-white font-semibold py-1 right-[-35px] top-[32px] w-[170px] z-0">
                        Limited Stock
                    </div>
                }
                <Link to={"/product/" + product?._id} className="hover:underline">
                    <h5 className='text-xl font-semibold tracking-tight text-white'>{product.name}</h5>
                    <div className='mt-2 mb-5 flex items-center justify-between'>
                        <p>
                            <span className='text-3xl font-bold text-emerald-400'><RenderPrice selected={selected} product={newProduct} /></span>
                        </p>
                    </div>
                </Link>
                <div className="flex">
                    <div className="flex w-1/2 max-h-10 mb-10 mr-4">
                        <button
                            className='flex items-center justify-end rounded-lg bg-emerald-600 px-2.5 md:px-5 py-2.5 text-center text-sm font-medium
                            text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart size={22} className='mr-2' />
                            Add to cart
                        </button>
                    </div>
                    <div className="flex flex-col">
                        <div>
                            {selected?.length > 1 &&
                                <div className="">
                                    <Select
                                        className="bg-emerald-600 hover:bg-emerald-700 rounded-lg mt-1 w-1/2 text-black"
                                        options={selected}
                                        labelField="size"
                                        valueField="size"
                                        onChange={(values) => setS(values)}
                                        placeholder="Select size"
                                        closeOnSelect={true}
                                        searchable={false}
                                    />
                                </div>
                            }
                        </div>
                        <div>
                            {colorOptions?.length > 0 &&
                                <div className="">
                                    <Select
                                        className="bg-emerald-600 hover:bg-emerald-700 rounded-lg mt-1 w-1/2 text-black"
                                        options={colorOptions.map(color => ({ label: color, value: color }))}
                                        labelField="label"
                                        valueField="value"
                                        onChange={(values) => setColor(values[0]?.value)}
                                        placeholder="Select color"
                                        closeOnSelect={true}
                                        searchable={false}
                                    />
                                </div>
                            }
                        </div>
                    </div>
                    
                </div>
                <div className='mt-5 mb-2 font-medium flex items-center justify-between'>
                    <p>
                        <span className='text-emerald-100'>{newProduct?.description}</span>
                    </p>
                </div>
            </div>
        </div>
	)
}
export default ProductCard

function RenderPrice({selected, product}){
    let price = 0

    if (selected.length > 1)
    {
        price = product?.info?.price
    }
    else{
        price = selected[0]?.price
    }

    return(
        <>
            {product.info.slash ?
            <><s>Rs.{product.info.slash}</s> &nbsp;Rs.{price}</>
            : <>Rs.{price}</>}
        </>
    )
}