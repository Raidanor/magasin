import { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore"

const OrderItem = ({product}) => {

    const { getOneProduct, oneProduct } = useProductStore()
    const [ newProduct, setNewProduct ] = useState({})

    // let copiedProduct = {}
    // useEffect(() => {
    //     getOneProduct(product.product)
    //     copiedProduct = JSON.parse(JSON.stringify(oneProduct))
    // }, [])

    // const copiedProduct = JSON.parse(JSON.stringify(oneProduct))

    // useEffect(() => {
    //     const copiedProduct2 = JSON.parse(JSON.stringify(copiedProduct))
    //     setNewProduct(copiedProduct2)
    // },[])


    return (
        <div className="p-2 justify-start">
            <Link to={"/product/" + product?.id} >
                <div className="border rounded-lg p-2 bg-emerald-900 grid grid-cols-2">
                    <div className=''>
                        <span className='text-3xl'><u>{product?.name}</u></span>
                        <br />
                        Quantity: {product.quantity}
                        <br />
                        Size: {product.info.size}
                        <br />
                        Price: {product.info.price}
                    </div>
                    <div className='justify-self-end flex w-1/2'>
                        {product?.images ? 
                            <img className="object-cover" src={product?.images[0]} alt="product image" />
                            : <></>
                        }
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default OrderItem