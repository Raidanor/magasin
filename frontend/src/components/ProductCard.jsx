import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useEffect, useState } from "react";
import Select from "react-dropdown-select"

const ProductCard = ({ product }) => {
	const { user } = useUserStore();
	const { addToCart } = useCartStore();

    const [s, setS] = useState("")

    useEffect(() => {
        console.log(s[0])
    })

    const options = [
        {
          id: 1,
          name: 'Leanne Graham'
        },
        {
          id: 2,
          name: 'Ervin Howell'
        }
      ];



	const handleAddToCart = () => {
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		}
        else {
			// add to cart
			// addToCart(product);
            console.log(product)
		}
	};

	return (
        
            <div className='flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg mb-4'>
                <div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'>
                    <img className='object-cover w-full' src={product.image} alt='product image' />
                    {/* <div className='absolute inset-0 bg-black bg-opacity-20' /> */}
                </div>
                

                <div className='mt-4 px-5 pb-5'>
                    <h5 className='text-xl font-semibold tracking-tight text-white'>{product.name}</h5>
                    <div className='mt-2 mb-5 flex items-center justify-between'>
                        <p>
                            <span className='text-3xl font-bold text-emerald-400'>Rs.{product.price}</span>
                        </p>
                    </div>
                    <div>
                        <button
                            className='flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
                            text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart size={22} className='mr-2' />
                            Add to cart
                        </button>

                        
                            { product.sizes.length > 0 &&
                                <select className="flex bg-emerald-600 rounded-lg mt-2" >
                                    {product.sizes.map(size => (
                                        <option  value={size}>{size}</option>
                                    ))}
                                </select>
                            }
                        <Select
                            className="flex bg-emerald-600 rounded-lg mt-2 text-black my-10"
                            options={options}
                            labelField="name"
                            valueField="id"
                            onChange={(values) => setS(values)}
                            
                            closeOnSelect={true}
                        />
                            
                        
                    </div>
                </div>
            </div>
       
	);
};
export default ProductCard;
