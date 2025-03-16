import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useEffect, useState } from "react";
import Select from "react-dropdown-select"

const ProductCard = ({ product }) => {
	const { user } = useUserStore();
	const { addToCart } = useCartStore();

    const [newProduct, setNewProduct] = useState(product)
    

    const [s, setS] = useState("")

    useEffect(() => {
        let newInfo = {}
        product.info.forEach(element => {
            if (element.size === s[0]?.size) {
                newInfo = {price: element.price, size: s[0].size}
                setNewProduct({...newProduct,  info: newInfo})
            }
        });
    }, [s])

    const selected = product.info

    useEffect(() => {
        if (Array.isArray(newProduct.info)) { setNewProduct({...newProduct,  info: newProduct.info[0]}) }
    })

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
            else {
                
                // setNewProduct({...newProduct,  info: newProduct.info[0]})
                if (Array.isArray(newProduct.info)) { setNewProduct({...newProduct,  info: newProduct.info[0]}) }

                addToCart(newProduct)
                console.log(newProduct)
            }
		}
	};

	return (
        
        <div className='flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg mb-4'>
            <div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'>
                <img className='object-cover w-full' src={product.image} alt='product image' />
                {/* <div className='absolute inset-0 bg-black bg-opacity-20' /> */}
            </div>
            

            <div className='mt-4 px-5 pb-5 z-0'>
                <h5 className='text-xl font-semibold tracking-tight text-white'>{product.name}</h5>
                <div className='mt-2 mb-5 flex items-center justify-between'>
                    <p>
                        <span className='text-3xl font-bold text-emerald-400'>Rs.{selected?.length > 1 ? newProduct?.info?.price : selected[0]?.price}</span>
                    </p>
                </div>
                <div className="flex">
                    <div className="flex w-50 max-h-10 mb-10 mr-4">
                        <button
                            className='flex items-center justify-end rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
                            text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart size={22} className='mr-2' />
                            Add to cart
                        </button>
                    </div>

                    {selected?.length > 1 &&
                        <div className="">
                            <Select
                                className="bg-emerald-600 hover:bg-emerald-700 rounded-lg mt-1 z-100 w-40 text-black"
                                options={selected}
                                labelField="size"
                                valueField="price"
                                onChange={(values) => setS(values)}
                                placeholder="Select for price..."
                                closeOnSelect={true}
                            />
                        </div>
                    }
                    
                    {/* { product.info.length > 0 &&
                        <select className="flex bg-emerald-600 rounded-lg mt-2 justify-items-end" onChange={(values) => setS(values)}>
                            {product.info.map(inf => (
                                <option value={inf.size}>{inf.size}</option>
                            ))}
                        </select>
                    } */}
                    
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