import { createContext, useEffect, useState } from "react";
import { products } from "../assets/frontend-assests/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

  const currency = "₹";
  const delivery_fee = 10;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const navigate= useNavigate();

  /* ================= ADD TO CART ================= */
  const addToCart = (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    let cartData = JSON.parse(JSON.stringify(cartItems));

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);
  };

  /* ================= UPDATE QUANTITY ================= */
  const updateQuantity = (itemId, size, quantity) => {
    let cartData = JSON.parse(JSON.stringify(cartItems));

    if (quantity === 0) {
      delete cartData[itemId][size];

      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][size] = quantity;
    }

    setCartItems(cartData);
  };

  /* ================= CART COUNT ================= */
  const getCartCount = () => {
    let totalCount = 0;

    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          totalCount += cartItems[items][item];
        }
      }
    }
    return totalCount;
  };

  /* ================= CART SUBTOTAL ================= */
  const getCartAmount = () => {
    let totalAmount = 0;

    for (const productId in cartItems) {
      const productData = products.find(
        (product) => product._id === productId
      );

      for (const size in cartItems[productId]) {
        if (cartItems[productId][size] > 0) {
          totalAmount +=
            productData.price * cartItems[productId][size];
        }
      }
    }
    return totalAmount;
  };

  /* ================= CART TOTAL ================= */
  const getCartTotal = () => {
    return getCartAmount() + delivery_fee;
  };

  /* ================= DEBUG ================= */
  useEffect(() => {
    console.log("Cart Items:", cartItems);
  }, [cartItems]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    updateQuantity,
    getCartCount,
    getCartAmount,
    getCartTotal,
    navigate
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
