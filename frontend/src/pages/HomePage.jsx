import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import { useCategoryStore } from "../stores/useCategoryStore";

import FeaturedProducts from "../components/FeaturedProducts";

import logo from "../../public/diamond3.svg"

const HomePage = () => {
	const { fetchFeaturedProducts, products, isLoading } = useProductStore();

    const { categories, getCategories } = useCategoryStore()

	useEffect(() => {
		fetchFeaturedProducts();
        getCategories()
	}, [fetchFeaturedProducts, getCategories]);

	return (
		<div className='relative min-h-screen text-white overflow-hidden'>
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
                <img src={logo} alt="The Best Choice" className="w-1/4 md:w-1/6 mx-auto" />
				<h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
					Explore Our Categories
				</h1>
				<p className='text-center text-xl text-gray-300 mb-12'>
					Discover the latest trends in eco-friendly fashion
				</p>

                {!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
                
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>
			</div>
		</div>
	);
};
export default HomePage;