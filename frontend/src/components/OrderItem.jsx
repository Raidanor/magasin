import { Link } from "react-router-dom";

const OrderItem = ({product}) => {

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