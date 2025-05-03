import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight, BoxesIcon } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";

const FeaturedProducts = ({ featuredProducts }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(4);

	const { addToCart } = useCartStore();

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) setItemsPerPage(1);
			else if (window.innerWidth < 1024) setItemsPerPage(2);
			else if (window.innerWidth < 1280) setItemsPerPage(3);
			else setItemsPerPage(4);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

    const handleAddToCart = (p) => {
        const temp = {
            _id: p._id,
            info: p.info[0],
            quantity: p.quantity,
            images: p.images,
            description: p.description,
            name: p.name
        }
        addToCart(temp)
    }

	const nextSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
	};

	const prevSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
	};

	const isStartDisabled = currentIndex === 0;
	const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

    // for inner carousel
    // const [currentIndexInner, setCurrentIndexInner] = useState(0);
	return (
		<div className='py-12'>
			<div className='container mx-auto px-4'>
				<h2 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>Featured</h2>
				<div className='relative'>
					<div className='overflow-hidden'>
						<div
							className='flex transition-transform duration-300 ease-in-out'
							style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
						>
							{featuredProducts?.map((product) => {
                                return(
								<div key={product._id} className='w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2'>
                                        <div className='bg-gray-800 bg-opacity-10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl border border-emerald-500/30'>
                                        {product.isLimited &&
                                            <div className="absolute transform rotate-45 bg-red-600 text-center text-white font-semibold py-1 right-[-35px] top-[32px] w-[170px] z-99">
                                                Limited Stock
                                            </div>
                                        }
                                        <InnerCarouselImages images={product.images} />

										<div className='p-4'>
                                            <Link to={"/product/" + product?._id} className="hover:underline">
											<h3 className='text-lg font-semibold mb-2 text-white'>{product.name}</h3>
											<p className='text-emerald-300 font-medium mb-4'>
												Rs.{product?.info[0]?.price}
											</p>
                                            </Link>
											<button
												onClick={() => {handleAddToCart(product)}}
												className='w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded transition-colors duration-300 
												flex items-center justify-center'
											>
												<ShoppingCart className='w-5 h-5 mr-2' />
												Add to Cart
											</button>
										</div>
									</div>
								</div>
							)})}
						</div>
					</div>
					<button
						onClick={prevSlide}
						disabled={isStartDisabled}
						className={`absolute top-1/2  -left-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
							isStartDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"
						}`}
					>
						<ChevronLeft size={40} />
					</button>

					<button
						onClick={nextSlide}
						disabled={isEndDisabled}
						className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
							isEndDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"
						}`}
					>
						<ChevronRight size={40}/>
					</button>
				</div>
			</div>
		</div>
	);
};
export default FeaturedProducts;

const InnerCarouselImages = ({images}) => {
    const [currentIndexInner, setCurrentIndexInner] = useState(0);
    const prevSlideInner = () => {
        setCurrentIndexInner((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
    const nextSlideInner = () => {
        setCurrentIndexInner((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }

    return(
        <div className="flex w-full relative flex-col overflow-hidden rounded-lg border-gray-700 shadow-lg mb-4">
            <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
                <img
                src={images[currentIndexInner]}
                className="object-cover w-full"
                />
            </div>
            {images?.length > 1 &&
            <>
                <button
                    onClick={prevSlideInner}
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={nextSlideInner}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700"
                >
                    <ChevronRight size={20} />
                </button>
            </>
            }
        </div>
    )
}