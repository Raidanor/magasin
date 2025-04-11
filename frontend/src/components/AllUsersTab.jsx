import { useEffect } from 'react'
import { motion } from "framer-motion";
import { useUserStore } from '../stores/useUserStore';

const AllUsersTab = () => {
    const { allUsers, loading, getAllUsers } = useUserStore()

    useEffect(() => {
        getAllUsers()
    }, [getAllUsers])

    return (
        <motion.div
			className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-2xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<h2 className='text-2xl font-semibold mb-6 text-emerald-300'>All Users</h2>
            { allUsers?.map((user) => 
                <div className=" border rounded-lg p-5 my-2 w-full">
                    <p>Name: {user.name}</p>
                    <p>Email:  {user.email}</p>
                    <p>Phone Number:  {user.phoneNumber}</p>
                    <p>Address:  {user.address}</p>
                    <p>Cart Items: </p>
                    <div className="grid grid-cols-4"> 
                    { user.cartItems.length > 0 ? 
                        user.cartItems?.map((item) => 
                            <div className="text-xs p-2 justify-start">
                                <div className="border rounded-lg p-2 bg-emerald-900">
                                    <span className='text-lg'><u>{item.name}</u></span>
                                    <br />
                                    Quantity: {item.quantity}
                                    <br />
                                    Size: {item.info.size}
                                    <br />
                                    Price: {item.info.price}
                                </div>
                            </div>
                        ) : <> No items</> }

                    </div>
                </div>
            )}

            
        </motion.div>
    )
}

export default AllUsersTab