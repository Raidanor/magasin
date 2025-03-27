import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useCategoryStore } from "../stores/useCategoryStore";
import toast from "react-hot-toast";
import { Star, Trash } from "lucide-react"

const categories = ["jeans", "t-shirts", "shoes", "bags", "kitchenware"];


const ManageCategories = () => {
    const [newCategory, setNewCategory] = useState({
		name: "",
		imageURL: "",
        ref: ""
	});
 
    const [info, setInfo] = useState([])

	const { categories, createCategory, loading, getCategories, deleteCategory } = useCategoryStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await createCategory(newCategory);

			setNewCategory({ name: "", imagesURL: "", ref: "" });

		} catch (error) {
			console.log("error creating a product: ", error.message);
		}
	}

    const handleDelete = async (categoryId) => {
        console.log(categoryId)
        await deleteCategory(categoryId)
    }

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();

			reader.onloadend = () => {
				setNewCategory({ ...newCategory, imageURL: reader.result });
			};

			reader.readAsDataURL(file); // base64
		}
	};

    useEffect(() => {
        getCategories()
    }, [getCategories])

	return (
		<motion.div
			className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-2xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Create Category</h2>

            <form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label htmlFor='name' className='block text-sm font-medium text-gray-300'>
						Category Name
					</label>
					<input
						type='text'
						id='name'
						name='name'
						value={newCategory.name}
						onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
						required="true"
					/>
				</div>

                <div>
					<label htmlFor='ref' className='block text-sm font-medium text-gray-300'>
						Ref Link
					</label>
					<input
						type='text'
						id='ref'
						name='ref'
						value={newCategory.ref}
						onChange={(e) => setNewCategory({ ...newCategory, ref: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
						required
					/>
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
                    { newCategory.imageURL !== "" ? <span className='ml-3 text-sm text-gray-400'>Image Uploaded</span> : ""}
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
							Create Category
						</>
					)}
				</button>
			</form>


            <div className="mt-10 p-5 rounded-lg border">
                <h2 className='text-2xl font-semibold mb-6 text-red-500'>Delete Category</h2>
                <table className=' min-w-full divide-y divide-gray-700'>
				<thead className='bg-gray-700'>
					<tr>
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
							Ref
						</th>
                        <th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Products
						</th>
                        <th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Action
						</th>
					</tr>
				</thead>

				<tbody className='bg-gray-800 divide-y divide-gray-700'>
					{categories?.map((category) => (
						<tr key={category._id} className='hover:bg-gray-700'>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='flex items-center'>
									<div className='flex-shrink-0 h-10 w-10'>
										<img
											className='h-10 w-10 rounded-full object-cover'
											src={category.imageURL}
											alt={category.name}
										/>
									</div>
									<div className='ml-4'>
										<div className='text-sm font-medium text-white'>{category.name}</div>
									</div>
								</div>
							</td>

							<td className='px-6 py-4 whitespace-nowrap'>
								1
							</td>
                            <td className='px-6 py-4 whitespace-nowrap'>
								{category.ref}
							</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
								<button
									onClick={() => handleDelete(category._id)}
									className='text-red-400 hover:text-red-300'
								>
									<Trash className='h-5 w-5 mx-2' />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
            </div>
		</motion.div>
	);
}
export default ManageCategories;