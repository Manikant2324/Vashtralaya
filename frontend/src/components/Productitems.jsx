import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const Productitems = ({ id, image, name, price, stock }) => {
  const { currency, products } = useContext(ShopContext);

  const productStock = stock !== undefined ? stock : products.find(p => p._id === id)?.stock;
  const isOutOfStock = productStock !== undefined && productStock <= 0;

  return (
    <Link className='text-gray-700 cursor-pointer block group relative product-card' to={`/product/${id}`}>
      <div className='overflow-hidden relative rounded-lg bg-gray-100 aspect-[3/4] w-full'>
        <img
          className='hover:scale-110 transition duration-500 ease-out w-full h-full object-cover object-top'
          src={Array.isArray(image) ? image[0] : image}
          alt={name}
        />
        {isOutOfStock && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-md z-10">
            OUT OF STOCK
          </div>
        )}
      </div>
      <p className='pt-3 pb-1 text-sm font-medium text-gray-800 line-clamp-1 group-hover:text-black transition'>{name}</p>
      <p className='text-sm font-bold text-gray-900'>
        {currency}{price}
      </p>
    </Link>
  );
};

export default Productitems
