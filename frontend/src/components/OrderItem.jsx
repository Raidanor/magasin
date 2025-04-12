import { useEffect } from 'react'
import { Link } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore"

const OrderItem = ({product}) => {

    const { getOneProduct, oneProduct } = useProductStore()

    
    useEffect(() => {
        getOneProduct(product.product)
    }, [getOneProduct])

    const copiedProduct = JSON.parse(JSON.stringify(oneProduct))

    return (
        <div className="p-2 justify-start">
            <Link to={"/product/" + product?.product} >
                <div className="border rounded-lg p-2 bg-emerald-900 grid grid-cols-2">
                    <div className=''>
                        <span className='text-3xl'><u>{copiedProduct?.name}</u></span>
                        <br />
                        Quantity: {product.quantity}
                        <br />
                        Size: {product.info.size}
                        <br />
                        Price: {product.info.price}
                    </div>
                    <div className='justify-self-end flex w-1/2'>
                        {copiedProduct?.images ? 
                            <img className="object-cover" src={copiedProduct?.images[0]} alt="product image" />
                            : <></>
                        }
                        
                    </div>
                    
                </div>
            </Link>
        </div>
    )
}

export default OrderItem