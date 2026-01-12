import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/frontend-assests/assets";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity } =
    useContext(ShopContext);

  const navigate = useNavigate();

  const [cartData, setCartData] = useState([]);

  /* ================= cartItems → array ================= */
  useEffect(() => {
    const tempData = [];

    for (const productId in cartItems) {
      for (const size in cartItems[productId]) {
        if (cartItems[productId][size] > 0) {
          tempData.push({
            _id: productId,
            size,
            quantity: cartItems[productId][size],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  /* ================= totals ================= */
  const shippingFee = 10;

  const subtotal = cartData.reduce((acc, item) => {
    const product = products.find((p) => p._id === item._id);
    if (!product) return acc;
    return acc + product.price * item.quantity;
  }, 0);

  const total = subtotal + shippingFee;

  return (
    <div className="border-t pt-14">
      {/* ================= TITLE ================= */}
      <div className="mb-10">
        <Title text1="YOUR" text2="CART" />
      </div>

      {/* ================= CART ITEMS ================= */}
      <div>
        {cartData.map((item, index) => {
          const product = products.find((p) => p._id === item._id);
          if (!product) return null;

          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              {/* Product */}
              <div className="flex items-start gap-6">
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="w-16 sm:w-20"
                />

                <div>
                  <p className="text-xs sm:text-lg font-medium">
                    {product.name}
                  </p>

                  <div className="flex gap-5 mt-2">
                    <p>
                      {currency}
                      {product.price}
                    </p>
                    <p className="px-2 border bg-slate-50">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <input
                type="number"
                min={1}
                value={item.quantity}
                className="border max-w-14 px-2 py-1"
                onChange={(e) =>
                  updateQuantity(
                    item._id,
                    item.size,
                    Number(e.target.value)
                  )
                }
              />

              {/* Remove */}
              <img
                src={assets.bin_icon}
                alt="remove"
                className="w-4 cursor-pointer"
                onClick={() =>
                  updateQuantity(item._id, item.size, 0)
                }
              />
            </div>
          );
        })}
      </div>

      {/* ================= CART TOTALS + CHECKOUT ================= */}
      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">

          {/* Heading */}
          <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
            <p className="tracking-widest font-medium">
              CART TOTALS
            </p>
            <span className="flex-1 h-[1px] bg-gray-300"></span>
          </div>

          {/* Subtotal */}
          <div className="flex justify-between py-2 border-b text-sm">
            <p>Subtotal</p>
            <p className="text-gray-800">
              {currency}{subtotal}.00
            </p>
          </div>

          {/* Shipping */}
          <div className="flex justify-between py-2 border-b text-sm">
            <p>Shipping Fee</p>
            <p className="text-gray-800">
              {currency}{shippingFee}
            </p>
          </div>

          {/* Total */}
          <div className="flex justify-between py-3 font-medium">
            <p>Total</p>
            <p>
              {currency}{total}.00
            </p>
          </div>

          {/* Checkout Button */}
          <div className="w-full text-end mt-6">
            <button
              onClick={() => navigate('/place-order')}
              className="bg-black text-white px-8 py-3 text-sm tracking-widest hover:bg-gray-800 transition"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
