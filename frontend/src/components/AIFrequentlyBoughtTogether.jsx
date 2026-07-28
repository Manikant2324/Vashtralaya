import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { BsStars, BsPlusLg } from 'react-icons/bs';
import { toast } from 'react-toastify';

const AIFrequentlyBoughtTogether = ({ productId }) => {
  const { backendUrl, currency, addToCart } = useContext(ShopContext);
  const [bundleData, setBundleData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBundle = async () => {
      if (!productId) return;
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/ai/frequently-bought-together/${productId}`);
        if (response.data.success && response.data.bundle?.length > 1) {
          setBundleData(response.data);
        } else {
          setBundleData(null);
        }
      } catch (error) {
        console.error('Bundle fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBundle();
  }, [productId, backendUrl]);

  if (loading || !bundleData || !bundleData.bundle || bundleData.bundle.length < 2) return null;

  const handleAddBundleToCart = () => {
    bundleData.bundle.forEach((item) => {
      const sizeToUse = item.sizes && item.sizes.length > 0 ? item.sizes[0] : 'M';
      addToCart(item._id, sizeToUse);
    });
    toast.success('🎉 AI Bundle added to your cart with extra savings!');
  };

  return (
    <div className="my-10 p-6 bg-gradient-to-r from-gray-50 to-amber-50/30 rounded-2xl border border-gray-200 shadow-sm animate-fadeIn">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-black text-amber-300 rounded-lg">
          <BsStars className="text-lg" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">Frequently Bought Together</h3>
          <p className="text-xs text-gray-500">AI-curated style combo with exclusive bundle savings</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Bundle Items */}
        <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {bundleData.bundle.map((item, idx) => (
            <React.Fragment key={item._id}>
              <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-gray-200 min-w-[200px]">
                <img
                  src={Array.isArray(item.image) ? item.image[0] : item.image}
                  alt={item.name}
                  className="w-14 h-18 aspect-[3/4] object-cover rounded-lg"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-800 line-clamp-1">{item.name}</p>
                  <p className="text-xs text-gray-500 font-semibold">{currency}{item.price}</p>
                </div>
              </div>
              {idx < bundleData.bundle.length - 1 && (
                <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center text-gray-400 font-bold shrink-0">
                  <BsPlusLg className="text-xs" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Bundle Price & Add CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
          <div className="text-center sm:text-right">
            <p className="text-xs text-gray-500 line-through font-semibold">
              Total: {currency}{bundleData.totalOriginalPrice}
            </p>
            <p className="text-lg font-extrabold text-black">
              Bundle Price: {currency}{bundleData.bundleDiscountPrice}
            </p>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-0.5">
              Save {currency}{bundleData.savings} (10% Off)
            </span>
          </div>

          <button
            onClick={handleAddBundleToCart}
            className="w-full sm:w-auto px-6 py-3 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition cursor-pointer shadow-md uppercase tracking-wider whitespace-nowrap"
          >
            Add Style Bundle To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIFrequentlyBoughtTogether;
