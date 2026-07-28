import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend-assests/assets";
import RelatedProducts from "../components/RelatedProducts";
import ProductReview from "../components/ProductReview";
import AISizeFitAdvisor from "../components/AISizeFitAdvisor";
import AIFrequentlyBoughtTogether from "../components/AIFrequentlyBoughtTogether";
import { BsStars } from "react-icons/bs";
import { toast } from "react-toastify";

const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);

  /* ================= GET PRODUCT ================= */
  useEffect(() => {
    const product = products.find(item => item._id === productId);

    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  }, [productId, products]);

  if (!productData) {
    return <div className="opacity-0"></div>;
  }

  const isInStock = productData.stock !== undefined ? productData.stock > 0 : true;
  const avgRating = productData.rating || 0;

  const handleAddToCart = () => {
    if (!isInStock) {
      toast.error("This product is currently out of stock");
      return;
    }
    if (!size) {
      toast.error("Please select a size");
      return;
    }
    addToCart(productData._id, size);
  };

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
                alt={`Product thumbnail ${index + 1}`}
                onClick={() => setImage(item)}
                className={`w-[24%] sm:w-full aspect-square object-cover object-top cursor-pointer rounded border hover:opacity-80 transition ${image === item ? 'ring-2 ring-black' : ''}`}
              />
            ))}
          </div>

          <div className="w-full sm:w-[80%] relative aspect-[3/4] max-h-[600px] rounded-lg overflow-hidden bg-gray-100 border">
            <img src={image} alt={productData.name} className="w-full h-full object-cover object-top" />
            {!isInStock && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                <p className="text-white text-2xl font-bold tracking-wider">OUT OF STOCK</p>
              </div>
            )}
          </div>
        </div>

        {/* ================= PRODUCT INFO ================= */}
        <div className="flex-1">

          <h1 className="font-medium text-2xl mt-2">
            {productData.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.round(avgRating) ? 'text-yellow-400 text-lg' : 'text-gray-300 text-lg'}>
                  ★
                </span>
              ))}
            </div>
            <p className="ml-2 text-sm text-gray-600">({productData.reviews?.length || 0} reviews)</p>
            {avgRating > 0 && <p className="text-sm font-semibold">{avgRating.toFixed(1)}/5</p>}
          </div>

          <p className="mt-5 text-3xl font-medium">
            {currency}{productData.price}
          </p>

          {/* Stock Status */}
          <div className={`mt-2 px-3 py-1 rounded-full inline-block text-sm font-semibold ${
            isInStock 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isInStock ? `In Stock (${productData.stock})` : 'Out of Stock'}
          </div>

          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>

          {/* ================= SIZE ================= */}
          <div className="flex flex-col gap-4 my-8">
            <div className="flex items-center justify-between max-w-xs">
              <p className="font-semibold text-gray-800">Select Size</p>
              <button
                type="button"
                onClick={() => setIsSizeModalOpen(true)}
                className="flex items-center gap-1.5 text-xs text-black font-bold bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-full border border-amber-300 shadow-2xs cursor-pointer transition"
              >
                <BsStars className="text-amber-600 text-sm" /> AI Size Advisor
              </button>
            </div>

            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 rounded-md font-medium text-sm transition ${
                    size === item
                      ? "bg-black text-white border-black font-bold shadow-xs"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <AISizeFitAdvisor
            isOpen={isSizeModalOpen}
            onClose={() => setIsSizeModalOpen(false)}
            onSelectSize={(recommendedSize) => setSize(recommendedSize)}
          />

          {/* ================= ADD TO CART ================= */}
          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className={`${
              isInStock 
                ? 'bg-black text-white hover:bg-gray-800' 
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
            } px-8 py-3 text-sm transition`}
          >
            {isInStock ? 'ADD TO CART' : 'OUT OF STOCK'}
          </button>

          <hr className="mt-8 sm:w-4/5" />

          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>✓ 100% Original product.</p>
            <p>✓ Cash on delivery available.</p>
            <p>✓ Easy return within 7 days.</p>
            {isInStock && <p>✓ Free shipping on orders above ₹500.</p>}
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
            Reviews ({productData.reviews?.length || 0})
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
            <div className="w-full">
              <ProductReview productId={productId} />
            </div>
          )}
        </div>
      </div>

      {/* ================= AI FREQUENTLY BOUGHT TOGETHER ================= */}
      <AIFrequentlyBoughtTogether productId={productId} />

      {/* ================= RELATED PRODUCTS ================= */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />

    </div>
  );
};

export default Product;
