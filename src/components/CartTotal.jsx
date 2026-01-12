import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const CartTotal = () => {

  const { currency, delivery_fee, cartItems, products } = useContext(ShopContext);

  let subtotal = 0;

  for (const productId in cartItems) {
    const product = products.find(p => p._id === productId);
    if (!product) continue;

    for (const size in cartItems[productId]) {
      subtotal += product.price * cartItems[productId][size];
    }
  }

  return (
    <div className="border border-gray-300 p-4">

      <h2 className="text-lg font-medium mb-4">
        CART TOTALS —
      </h2>

      <div className="flex justify-between mb-2 text-sm">
        <p>Subtotal</p>
        <p>{currency}{subtotal}</p>
      </div>

      <div className="flex justify-between mb-2 text-sm">
        <p>Shipping Fee</p>
        <p>{currency}{delivery_fee}</p>
      </div>

      <hr className="my-2" />

      <div className="flex justify-between font-semibold">
        <p>Total</p>
        <p>{currency}{subtotal + delivery_fee}</p>
      </div>

    </div>
  );
};

export default CartTotal;
