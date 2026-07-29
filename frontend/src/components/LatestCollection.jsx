import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Productitems from './Productitems';
import Title from './Title';
import { ProductSkeleton } from './Loader';

const LatestCollection = () => {
  const { products, loading } = useContext(ShopContext);

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1="LATEST" text2="COLLECTION" />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Explore our newest fashion arrivals featuring modern cuts, vibrant colors, and handcrafted premium fabrics.
        </p>
      </div>

      {loading ? (
        <ProductSkeleton count={10} />
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
          {products.slice(0, 10).map((item) => (
            <Productitems
              key={item._id}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
              stock={item.stock}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LatestCollection;
