import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

  const currency = "₹";
  const delivery_fee = 10;

  const getBackendUrl = () => {
    const envUrl = import.meta.env.VITE_BACKEND_URL;
    if (envUrl && envUrl.trim() !== '' && envUrl !== 'http://localhost:4000' && envUrl !== 'http://localhost:4000/') {
      return envUrl.replace(/\/+$/, '');
    }
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:4000';
      }
      return '';
    }
    return '';
  };
  const backendUrl = getBackendUrl();

  const [productsList, setProductsList] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : {};
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem("adminToken") || "");
  const navigate = useNavigate();

  /* ================= FETCH PRODUCTS FROM BACKEND ================= */
  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success && Array.isArray(response.data.products)) {
        const backendProducts = response.data.products;
        setProductsList(backendProducts);

        // Clean up cart items that don't match any real backend product
        setCartItems(prev => {
          const validIds = new Set(backendProducts.map(p => p._id));
          const cleaned = {};
          let didClean = false;
          for (const pid in prev) {
            if (validIds.has(pid)) {
              cleaned[pid] = prev[pid];
            } else {
              didClean = true;
            }
          }
          if (didClean) {
            localStorage.setItem("cartItems", JSON.stringify(cleaned));
          }
          return didClean ? cleaned : prev;
        });
      } else {
        setProductsList([]);
      }
    } catch (error) {
      console.log("Failed to fetch products from backend API:", error);
      setProductsList([]);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  /* ================= PERSIST CART ================= */
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  /* ================= ADD TO CART ================= */
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    const itemInfo = productsList.find((product) => product._id === itemId);
    if (!itemInfo) {
      toast.error("Product not found");
      return;
    }

    if (itemInfo.stock !== undefined && itemInfo.stock <= 0) {
      toast.error("Product is Out of Stock");
      return;
    }

    let cartData = JSON.parse(JSON.stringify(cartItems));
    const currentQty = (cartData[itemId] && cartData[itemId][size]) || 0;

    if (itemInfo.stock !== undefined && currentQty + 1 > itemInfo.stock) {
      toast.error(`Cannot add more than available stock (${itemInfo.stock} items available)`);
      return;
    }

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
    toast.success("Added to cart");

    if (token) {
      try {
        await axios.post(backendUrl + '/api/user/add-to-cart', { productId: itemId, size }, { headers: { token } });
      } catch (error) {
        console.log(error);
      }
    }
  };

  /* ================= UPDATE QUANTITY ================= */
  const updateQuantity = async (itemId, size, quantity) => {
    const itemInfo = productsList.find((product) => product._id === itemId);
    if (quantity > 0 && itemInfo && itemInfo.stock !== undefined && quantity > itemInfo.stock) {
      toast.error(`Cannot add more than available stock (${itemInfo.stock} items available)`);
      return;
    }

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

    if (token) {
      try {
        await axios.post(backendUrl + '/api/user/update-cart', { cartData }, { headers: { token } });
      } catch (error) {
        console.log(error);
      }
    }
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
      const productData = productsList.find(
        (product) => product._id === productId
      );

      if (productData) {
        for (const size in cartItems[productId]) {
          if (cartItems[productId][size] > 0) {
            totalAmount += productData.price * cartItems[productId][size];
          }
        }
      }
    }
    return totalAmount;
  };

  /* ================= CART TOTAL ================= */
  const getCartTotal = () => {
    return getCartAmount() + delivery_fee;
  };

  /* ================= PERSIST TOKEN ================= */
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  /* ================= PERSIST ADMIN TOKEN ================= */
  useEffect(() => {
    if (adminToken) {
      localStorage.setItem("adminToken", adminToken);
    } else {
      localStorage.removeItem("adminToken");
    }
  }, [adminToken]);

  const adminLogout = () => {
    setAdminToken("");
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  const value = {
    products: productsList,
    getProductsData,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    updateQuantity,
    getCartCount,
    getCartAmount,
    getCartTotal,
    navigate,
    token,
    setToken,
    adminToken,
    setAdminToken,
    adminLogout,
    backendUrl
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
