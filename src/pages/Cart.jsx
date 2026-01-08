import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from '../assets/frontend-assests/assets'

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    updateQuantity
  } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  // 🔹 cartItems ko structured array me convert
  useEffect(() => {
    const tempData = [];

    for (const productId in cartItems) {
      for (const size in cartItems[productId]) {
        if (cartItems[productId][size] > 0) {
          tempData.push({
            _id: productId,
            size: size,
            quantity: cartItems[productId][size],
          });
        }
      }
    }

    setCartData(tempData);
  }, [cartItems]);

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-6">
        <Title text1="YOUR" text2="CART" />
      </div>

      <div>
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id
          );

          if (!productData) return null;

          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              {/* 🔹 Product Info */}
              <div className="flex items-start gap-6">
                <img
                  className="w-16 sm:w-20"
                  src={productData.image[0]}
                  alt={productData.name}
                />

                <div>
                  <p className="text-xs sm:text-lg font-medium">
                    {productData.name}
                  </p>

                  <div className="flex items-center gap-5 mt-2">
                    <p>
                      {currency}
                      {productData.price}
                    </p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>

              {/* 🔹 Quantity */}
              <input
                type="number"
                min={1}
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(
                    item._id,
                    item.size,
                    Number(e.target.value)
                  )
                }
              />

              {/* 🔹 Remove */}
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                src={assets.bin_icon}
                alt="remove"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Cart;
