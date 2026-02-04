const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                
                {/* Brand */}
                <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                    The Best Choice
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed">
                    Your go-to destination for quality products, unbeatable prices,
                    and fast delivery.
                </p>
                </div>

                {/* Shop */}
                {/* <div>
                    <h3 className="text-white font-semibold mb-4">Shop</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/products" className="hover:text-white">All Products</a></li>
                        <li><a href="/" className="hover:text-white">Categories</a></li>
                    </ul>
                </div> */}

                {/* Support */}
                <div>
                <h3 className="text-white font-semibold mb-4">Support</h3>
                    <div className="hover:text-white">Contact Us</div>
                    <div>jasbeen@the-best-choice.store</div>
                </div>

                {/* Newsletter / Social */}
                <div>
                    <h3 className="text-white font-semibold mb-4">Social</h3>
                    <div className="flex space-x-4 text-sm">
                        <a href="#" className="hover:text-white">Facebook</a>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
                {new Date().getFullYear()} The Best Choice
            </div>
        </footer>
    )
}

export default Footer;
