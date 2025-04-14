import { useEffect } from 'react'
import { motion } from "framer-motion";
import { useCartStore } from '../stores/useCartStore';

import OrderItem from "../components/OrderItem"

const PastOrders = () => {
    const { pastOrders, getPastOrders } = useCartStore()
    
    
    useEffect(() => {
        getPastOrders()
    }, [getPastOrders])


  return (
    <motion.div
			className='bg-gray-800 shadow-lg rounded-lg p-4 max-w-2xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Order History</h2>
            <div>
                { pastOrders?.length > 0 ? 
                    pastOrders?.map((order) => 
                    <div className="container border border-red-500 rounded-lg my-4">
                        <div className="bg-emerald-800 w-full rounded-lg border-b border-red-500 p-2">
                            Order date: {new Date(order.createdAt).toLocaleString('en-GB', { 
                                day:'numeric', 
                                month: 'long', 
                                year:'numeric', 
                                hour:"2-digit", 
                                minute: "2-digit", 
                                second:"2-digit", 
                                timeZone: 'Etc/GMT-4', 
                                timeZoneName: 'short'
                            })}
                        </div>
                        <div className='p-2'>
                            {order?.products?.map((product) => 
                                <OrderItem product={product} />
                            )}
                        
                        </div>
                    </div>
                ): <>No orders yet</>
                }
            </div>

            
        </motion.div>
  )
}

export default PastOrders