import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import { useCategoryStore } from "../stores/useCategoryStore";

import toast from "react-hot-toast";

const categories_ = ["jeans", "t-shirts", "shoes", "bags", "kitchenware"];

const CreateProductForm = () => {
    const { categories, getCategories } = useCategoryStore()

    useEffect(() => {
        getCategories()
    }, [getCategories])

	const [newProduct, setNewProduct] = useState({
		name: "",
		description: "",
		info: [],
		category: "",
		images: [],
	});
    
    const [s, setS] = useState('')
    const [slash, setSlash] = useState(null)
    const [p, setP] = useState(null)
    const [info, setInfo] = useState([])

    const [image, setImage] = useState("")

	const { createProduct, loading } = useProductStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
        if (info.length === 0)
        {
            toast.error("Price is needed")
            return
        }
		try {
			await createProduct(newProduct);
            // console.log(newProduct)
			setNewProduct({ name: "", description: "", info: [], category: "", images: [] });
            setInfo([])
            setS("")
            setP(null)
            setImage([])
            toast.success("Product created")
		} catch (error) {
			console.log("error creating a product: ", error.message);
		}
	}

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();

			reader.onloadend = () => {
				// setNewProduct({ ...newProduct, image: reader.result });
                setImage(image => [ ...image, reader.result ]);
			};

			reader.readAsDataURL(file); // base64
            // console.log(image)
		}
	};

    useEffect(() => {
        setNewProduct({...newProduct,  images: image })
    }, [newProduct.images, image])

    useEffect(() => {
        setNewProduct({...newProduct,  info: info })
    }, [newProduct.info, info])

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

	return (
		<motion.div
			className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Create New Product</h2>

            <form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label htmlFor='name' className='block text-sm font-medium text-gray-300'>
						Product Name
					</label>
					<input
						type='text'
						id='name'
						name='name'
						value={newProduct.name}
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
						value={newProduct.description}
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
						value={newProduct.price}
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
                    <div className="flex">
                        <button type="button" className='mr-auto flex justify-start mt-2 py-2 px-4 border border-transparent rounded-md 
                        shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
                        onClick={ addToArray }>Add</button>
                        
                        <button type="button" className="ml-auto flex mt-2 py-2 px-4 border border-transparent rounded-md 
                        shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-900 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 disabled:opacity-50" 
                        onClick={() => setInfo([])}>Clear</button>
                    </div>
				</div>
                <ul>
                    {info.map(inf => (
                        <li key={inf.size}>price: {inf.price} size: {inf.size} {inf?.slash ? <>slash: {inf?.slash}</> : <></>}</li>
                    ))}
                </ul>
				<div>
					<label htmlFor='category' className='block text-sm font-medium text-gray-300'>
						Category
					</label>
					<select
						id='category'
						name='category'
						value={newProduct.category}
						onChange={(e) => setNewProduct({ ...newProduct, category: JSON.parse(e.target.value) })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none 
						 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
						required
					>
						<option value=''>Select a category</option>
						    {categories.map((category) => (
							<option key={category._id} value={JSON.stringify(category)}>
								{category.name}
						</option>
						))}
					</select>
				</div>

				<div className='mt-1 flex items-center'>
					<input type='file' id='image' className='sr-only' accept='image/*' onChange={handleImageChange} />
					<label
						htmlFor='image'
						className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
					>
						<Upload className='h-5 w-5 inline-block mr-2' />
						Upload Image
					</label>
					{Array.isArray(image) && <span className='ml-3 text-sm text-gray-400'>{image.length} image(s) uploaded </span>}
				</div>

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
							Create Product
						</>
					)}
				</button>
			</form>                
		</motion.div>
	);
};
export default CreateProductForm;