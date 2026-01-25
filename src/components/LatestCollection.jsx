import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Productitems from './Productitems'   // 🔥 यही missing था

const LatestCollection = () => {
  const { products } = useContext(ShopContext)

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <p className='font-medium'>LATEST COLLECTION</p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
        {products.slice(0, 8).map((item) => (
          <Productitems
            key={item._id}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  )
}

export default LatestCollection
