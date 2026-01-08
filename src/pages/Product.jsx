import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend-assests/assets";
import RelatedProducts from "../components/RelatedProducts";
import { toast } from "react-toastify";

const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  /* ================= GET PRODUCT ================= */
  useEffect(() => {
    const product = products.find(item => item._id === productId);

    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  }, [productId, products]);

  /* ================= ADD TO CART ================= */
  const handleAddToCart = () => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }
    addToCart(productData._id, size);
  };

  if (!productData) {
    return <div className="opacity-0"></div>;
  }

  return (
    <div className="border-t-2 pt-10">

      {/* ================= PRODUCT SECTION ================= */}
      <div className="flex gap-12 flex-col sm:flex-row">

        {/* ================= IMAGES ================= */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">

          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll gap-2 sm:w-[20%]">
            {productData.image.map((item, index) => (
              <img
                key={index}
                src={item}
                alt=""
                onClick={() => setImage(item)}
                className="w-[24%] sm:w-full cursor-pointer border"
              />
            ))}
          </div>

          <div className="w-full sm:w-[80%]">
            <img src={image} alt="" className="w-full h-auto" />
          </div>
        </div>

        {/* ================= PRODUCT INFO ================= */}
        <div className="flex-1">

          <h1 className="font-medium text-2xl mt-2">
            {productData.name}
          </h1>

          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} className="w-3.5" />
            <img src={assets.star_icon} className="w-3.5" />
            <img src={assets.star_icon} className="w-3.5" />
            <img src={assets.star_icon} className="w-3.5" />
            <img src={assets.star_dull_icon} className="w-3.5" />
            <p className="pl-2 text-sm">(122)</p>
          </div>

          <p className="mt-5 text-3xl font-medium">
            {currency}{productData.price}
          </p>

          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>

          {/* ================= SIZE ================= */}
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>

            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 ${
                    size === item
                      ? "bg-black text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* ================= ADD TO CART ================= */}
          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            ADD TO CART
          </button>

          <hr className="mt-8 sm:w-4/5" />

          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery available.</p>
            <p>Easy return within 7 days.</p>
          </div>

        </div>
      </div>

      {/* ================= DESCRIPTION / REVIEW ================= */}
      <div className="mt-20">

        <div className="flex">
          <button
            onClick={() => setActiveTab("description")}
            className={`border px-5 py-3 text-sm ${
              activeTab === "description" ? "bg-gray-100" : ""
            }`}
          >
            Description
          </button>

          <button
            onClick={() => setActiveTab("review")}
            className={`border px-5 py-3 text-sm ${
              activeTab === "review" ? "bg-gray-100" : ""
            }`}
          >
            Reviews (122)
          </button>
        </div>

        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          {activeTab === "description" ? (
            <>
              <p>
                An e-commerce website is an online platform that facilitates the
                buying and selling of products or services over the internet.
              </p>
              <p>
                These websites typically display products with descriptions,
                images, prices, and reviews.
              </p>
            </>
          ) : (
            <>
              <p>⭐️⭐️⭐️⭐️⭐️ Amazing quality product</p>
              <p>⭐️⭐️⭐️⭐️ Worth the price</p>
              <p>⭐️⭐️⭐️ Good but delivery was late</p>
            </>
          )}
        </div>
      </div>

      {/* ================= RELATED PRODUCTS ================= */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />

    </div>
  );
};

export default Product;
