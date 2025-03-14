import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const categories = ["jeans", "t-shirts", "shoes", "bags", "kitchenware"];

const CreateProductForm = () => {
	const [newProduct, setNewProduct] = useState({
		name: "",
		description: "",
		info: [],
		category: "",
		image: "",
	});
    
    const [s, setS] = useState('')
    const [p, setP] = useState('')
    const [info, setInfo] = useState([])

	const { createProduct, loading } = useProductStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
            console.log(newProduct)
			await createProduct(newProduct);

			setNewProduct({ name: "", description: "", info: [], category: "", image: "" });
            setArray([])
		} catch {
			console.log("error creating a product");
		}
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();

			reader.onloadend = () => {
				setNewProduct({ ...newProduct, image: reader.result });
			};

			reader.readAsDataURL(file); // base64
		}
	};

    useEffect(() => {
        setNewProduct({...newProduct,  info: info })
    }, [newProduct.info, info])

    const addToArray = async() => {
        try {
            setInfo(info => [...info, {price: p, size: s}])
            setP("")
            setS("")
        } catch (error) {
            console.log("error in addToArray")
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

			{/* <form onSubmit={handleSubmit} className='space-y-4'> */}
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
                    <div className="flex w-100 my-2">
					<input
						type='number'
						id='price'
						name='price'
						value={newProduct.price}
						onChange={(e) => setP(e.target.value)}
						step='0.01'
                        placeholder="Price"
						className='mt-1 block w-50 bg-gray-700 border border-gray-600 rounded-md shadow-sm 
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
						className='flex ml-2 mt-1 w-50 bg-gray-700 border border-gray-600 rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none 
						 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
						
					    >
					</input>
                    <br/>
                    </div>
                    <button className='flex justify-center mt -2 py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
                    onClick={ addToArray }>Add</button>
                    
                    
				</div>
                <ul>
                    {info.map(inf => (
                        <li>price: {inf.price} size: {inf.size}</li>
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

				<div className='mt-1 flex items-center'>
					<input type='file' id='image' className='sr-only' accept='image/*' onChange={handleImageChange} />
					<label
						htmlFor='image'
						className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
					>
						<Upload className='h-5 w-5 inline-block mr-2' />
						Upload Image
					</label>
					{newProduct.image && <span className='ml-3 text-sm text-gray-400'>Image uploaded </span>}
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

            {/* <div>
                <label htmlFor='size' className='block text-sm font-medium text-gray-300'>
                    Add size (Optional)
                </label>
                <input
                    id='size'
                    name='size'
                    type='text'
                    value={s}
                    onChange={(e) => setS(e.target.value)}
                    className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
                        shadow-sm py-2 px-3 text-white focus:outline-none 
                        focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                    
                    >
                </input>
                <br/>
                <button className='flex justify-center py-2 px-4 border border-transparent rounded-md 
                shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
                onClick={ addToArray }>Add</button>
            </div> */}

                
		</motion.div>
	);
};
export default CreateProductForm;