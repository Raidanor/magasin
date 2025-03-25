import { motion } from "framer-motion";
import { Trash, Star, Edit3, XCircle, Upload, PlusCircle, Loader } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

import { useEffect, useState } from "react";

import toast from "react-hot-toast";

const categories = ["jeans", "t-shirts", "shoes", "bags", "kitchenware"];

const ProductsList = () => {
	const { deleteProduct, editProduct, toggleFeaturedProduct, products, loading, getOneProduct, oneProduct } = useProductStore();

    const [isOpen, setIsOpen] = useState(false)

    const openModal = async (productId) => {
        setIsOpen(true)
        await getOneProduct(productId)
    }
    

	return (
		<motion.div
			className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto flex'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<table className=' min-w-full divide-y divide-gray-700'>
				<thead className='bg-gray-700'>
					<tr>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Product
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Price
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Category
						</th>

						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Featured
						</th>
						<th
							scope='col'
							className='px-8 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Actions
						</th>
					</tr>
				</thead>

				<tbody className='bg-gray-800 divide-y divide-gray-700'>
					{products?.map((product) => (
						<tr key={product._id} className='hover:bg-gray-700'>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='flex items-center'>
									<div className='flex-shrink-0 h-10 w-10'>
										<img
											className='h-10 w-10 rounded-full object-cover'
											src={product.images[0]}
											alt={product.name}
										/>
									</div>
									<div className='ml-4'>
										<div className='text-sm font-medium text-white'>{product.name}</div>
									</div>
								</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								{product.info.map(p => (
                                    <div key={p.size} className='text-sm text-gray-300 my-0.5'>
                                        Rs.{p.price}
                                        &emsp;
                                        {p.size ? p.size : ""}
                                    </div>
                                ))}
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='text-sm text-gray-300'>{product.category}</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<button
									onClick={() => toggleFeaturedProduct(product._id)}
									className={`p-1 rounded-full ${
										product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"
									} hover:bg-yellow-500 transition-colors duration-200`}
								>
									<Star className='h-5 w-5' />
								</button>
							</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
								<button
									onClick={() => deleteProduct(product._id)}
									className='text-red-400 hover:text-red-300'
								>
									<Trash className='h-5 w-5 mx-2' />
								</button>
                                <button
									onClick={() => openModal(product._id)}
									className='text-gray-400 hover:text-white'
								>
									<Edit3 className='h-5 w-5 mx-2' />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
            <EditForm open={isOpen} onClose={() => {setIsOpen(false)}}>
                <h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Create New Product</h2>

            
            </EditForm>
		</motion.div>
	);
};
export default ProductsList;


function EditForm({open, onClose, children})
{
    if (!open) return null

    const { editProduct, loading, getOneProduct, oneProduct } = useProductStore();

    const [newProduct, setNewProduct] = useState({});
    

   
    const [s, setS] = useState('')
    const [slash, setSlash] = useState(null)
    const [p, setP] = useState(0)
    const [info, setInfo] = useState(oneProduct.info)

    const [image, setImage] = useState("")


    const handleSubmit = async (e) => {
        e.preventDefault();
        setNewProduct({...newProduct,  info: info })

        await editProduct(newProduct)
        console.log(newProduct)
    }

    const handleImageChange = (e) => {

    }

    useEffect(() => {
        setNewProduct(oneProduct)
    }, [setNewProduct, oneProduct])

    useEffect(() => {
        setInfo(oneProduct.info)
    }, [setInfo, oneProduct.info])

    useEffect(() => {
        setNewProduct({...newProduct,  info: info })
    }, [setNewProduct, info])

    const addToArray = async() => {
        try {
            if (p === null) 
            {
                toast.error("Price cannot be empty")
                return
            }
            
            setInfo(info => [...info, {price: p, size: s, slash: slash}])
            setP(null)
            setS("")
        } catch (error) {
            console.log("error in addToArray", error)
        }
    }
    return(
        <div className="fixed inset-0 flex justify-center items-center transition-colors 
           bg-black/60"
            onClick={onClose}
        >
            <div className={`w-1/2 py-10 px-5 items-center bg-gray-800 rounded-xl shadow transition-all outline-1 outline-gray-400
                ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
            `}
            onClick={e => e.stopPropagation()}>
                <button
                    className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-auto hover:bg-red-900/40 hover:text-gray-600"
                    onClick={onClose}
                >
                    <XCircle className="text-red-600"/>
                </button>
                {children}
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label htmlFor='name' className='block text-sm font-medium text-gray-300'>
                            Product Name
                        </label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            value={newProduct?.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
                            px-3 text-white focus:outline-none focus:ring-2
                            focus:ring-emerald-500 focus:border-emerald-500'
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor='description' className='block text-sm font-medium text-gray-300'>
                            Description
                        </label>
                        <textarea
                            id='description'
                            name='description'
                            value={newProduct?.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            rows='3'
                            className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
                            py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 
                            focus:border-emerald-500'
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor='price' className='block text-sm font-medium text-gray-300'>
                            Add Price & Size
                        </label>
                        <div className="flex my-2">
                        <input
                            type='number'
                            id='price'
                            name='price'
                            value={newProduct?.price}
                            onChange={(e) => setP(e.target.value)}
                            step='0.01'
                            placeholder="Price"
                            className='mt-1 block w-1/3 bg-gray-700 border border-gray-600 rounded-md shadow-sm 
                            py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
                            focus:border-emerald-500'
                            required
                        />

                        <input
                            id='size'
                            name='size'
                            type='text'
                            value={s}
                            placeholder="Size(Optional)"
                            onChange={(e) => setS(e.target.value)}
                            className='flex ml-2 mt-1 w-1/3 bg-gray-700 border border-gray-600 rounded-md
                            shadow-sm py-2 px-3 text-white focus:outline-none 
                            focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                            >
                        </input>

                        <input
                            id='slash'
                            name='slash'
                            type='number'
                            value={slash}
                            placeholder="Slash(Optional)"
                            onChange={(e) => setSlash(e.target.value)}
                            className='flex ml-2 mt-1 w-1/3 bg-gray-700 border border-gray-600 rounded-md
                            shadow-sm py-2 px-3 text-white focus:outline-none 
                            focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                            >
                        </input>

                        <br/>
                        </div>
                        <div className="flex clearfix">
                            <button type="button" className='flex justify-center mt-2 py-2 px-4 border border-transparent rounded-md 
                            shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
                            onClick={ addToArray }>Add</button>

                            <button type="button" className="absolute right-5 flex mt-2 py-2 px-4 border border-transparent rounded-md 
                            shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-900 
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 disabled:opacity-50" onClick={() => setInfo([])}>Clear</button>
                        </div>
                        
                    </div>
                    
                    <ul className="p-2">
                        {info?.map(inf => (
                            <li key={inf.size}>price: {inf.price} size: {inf.size}</li>
                        ))}
                    </ul>
                        
                    <div>
                        <label htmlFor='category' className='block text-sm font-medium text-gray-300'>
                            Category
                        </label>
                        <select
                            id='category'
                            name='category'
                            value={newProduct?.category}
                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
                            shadow-sm py-2 px-3 text-white focus:outline-none 
                            focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                            required
                        >
                            <option value=''>Select a category</option>
                                {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                            </option>
                            ))}
                        </select>
                    </div>

                    {/* <div className='mt-1 flex items-center'>
                        <input type='file' id='image' className='sr-only' accept='image/*' onChange={handleImageChange} />
                        <label
                            htmlFor='image'
                            className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
                        >
                            <Upload className='h-5 w-5 inline-block mr-2' />
                            Upload Image
                        </label>
                        {Array.isArray(image) && <span className='ml-3 text-sm text-gray-400'>{image.length} image(s) uploaded </span>}
                    </div> */}

                    <button
                        onClick={handleSubmit}
                        className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                        shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                                Loading...
                            </>
                        ) : (
                            <>
                                <PlusCircle className='mr-2 h-5 w-5' />
                                Edit Product
                            </>
                        )}
                    </button>
                </form>  
            </div>
        </div>
    )
}