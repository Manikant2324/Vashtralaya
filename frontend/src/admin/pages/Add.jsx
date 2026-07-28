import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../../context/ShopContext";
import { assets } from "../../assets/frontend-assests/assets";

const Add = () => {
  const { adminToken, backendUrl, getProductsData } = useContext(ShopContext);

  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("100");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  const handleGenerateAIDescription = async () => {
    if (!name.trim()) {
      toast.error("Please enter a Product Name first to generate AI description.");
      return;
    }
    try {
      setAiGenerating(true);
      const response = await axios.post(backendUrl + "/api/ai/generate-description", {
        name,
        category,
        subCategory
      });
      if (response.data.success) {
        setDescription(response.data.description);
        toast.success("✨ AI Description generated successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate AI description.");
    } finally {
      setAiGenerating(false);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!adminToken) {
      toast.error("Admin authentication required. Please login again.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token: adminToken } }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Product added successfully!");
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
        setStock("100");
        setSizes([]);
        setBestseller(false);
        if (getProductsData) await getProductsData();
      } else {
        toast.error(response.data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Product add error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to add product"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size]
    );
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-4 max-w-4xl p-4 sm:p-6 bg-white rounded-xl border border-gray-200 shadow-sm animate-fadeIn"
    >
      <h2 className="text-xl font-bold text-gray-800 border-b pb-3 w-full">
        Add New Store Product
      </h2>

      <div>
        <p className="mb-2 text-sm font-semibold text-gray-700">Upload Product Images</p>
        <div className="flex gap-3">
          <label htmlFor="image1" className="cursor-pointer">
            <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg hover:border-black transition flex items-center justify-center overflow-hidden bg-gray-50">
              <img
                className="w-full h-full object-cover"
                src={!image1 ? assets.quality_icon || assets.search_icon : URL.createObjectURL(image1)}
                alt="upload_area_image"
              />
            </div>
            <input
              onChange={(e) => setImage1(e.target.files[0])}
              type="file"
              id="image1"
              accept="image/*"
              hidden
            />
          </label>

          <label htmlFor="image2" className="cursor-pointer">
            <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg hover:border-black transition flex items-center justify-center overflow-hidden bg-gray-50">
              <img
                className="w-full h-full object-cover"
                src={!image2 ? assets.quality_icon || assets.search_icon : URL.createObjectURL(image2)}
                alt="upload_area_image"
              />
            </div>
            <input
              onChange={(e) => setImage2(e.target.files[0])}
              type="file"
              id="image2"
              accept="image/*"
              hidden
            />
          </label>

          <label htmlFor="image3" className="cursor-pointer">
            <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg hover:border-black transition flex items-center justify-center overflow-hidden bg-gray-50">
              <img
                className="w-full h-full object-cover"
                src={!image3 ? assets.quality_icon || assets.search_icon : URL.createObjectURL(image3)}
                alt="upload_area_image"
              />
            </div>
            <input
              onChange={(e) => setImage3(e.target.files[0])}
              type="file"
              id="image3"
              accept="image/*"
              hidden
            />
          </label>

          <label htmlFor="image4" className="cursor-pointer">
            <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg hover:border-black transition flex items-center justify-center overflow-hidden bg-gray-50">
              <img
                className="w-full h-full object-cover"
                src={!image4 ? assets.quality_icon || assets.search_icon : URL.createObjectURL(image4)}
                alt="upload_area_image"
              />
            </div>
            <input
              onChange={(e) => setImage4(e.target.files[0])}
              type="file"
              id="image4"
              accept="image/*"
              hidden
            />
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2 text-sm font-semibold text-gray-700">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3.5 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black transition text-sm"
          type="text"
          placeholder="e.g. Classic Cotton Denim Shirt"
          required
        />
      </div>

      <div className="w-full">
        <div className="flex items-center justify-between max-w-[500px] mb-2">
          <p className="text-sm font-semibold text-gray-700">Product Description</p>
          <button
            type="button"
            onClick={handleGenerateAIDescription}
            disabled={aiGenerating}
            className="text-xs font-bold text-black bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-full border border-amber-300 transition cursor-pointer flex items-center gap-1 disabled:opacity-50"
          >
            {aiGenerating ? "Generating..." : "✨ Generate AI Description"}
          </button>
        </div>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3.5 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black transition text-sm min-h-[100px]"
          placeholder="Write detailed product description here..."
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:gap-6">
        <div>
          <p className="mb-2 text-sm font-semibold text-gray-700">Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full sm:w-[140px] px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-gray-700">Sub Category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            className="w-full sm:w-[150px] px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-gray-700">Price (₹)</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full sm:w-[130px] px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm"
            type="number"
            min="0"
            placeholder="25"
            required
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-gray-700">Stock Qty</p>
          <input
            onChange={(e) => setStock(e.target.value)}
            value={stock}
            className="w-full sm:w-[130px] px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm"
            type="number"
            min="0"
            placeholder="100"
            required
          />
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-gray-700">Available Sizes</p>
        <div className="flex gap-3">
          {["S", "M", "L", "XL", "XXL"].map((sz) => (
            <div key={sz} onClick={() => toggleSize(sz)}>
              <p
                className={`${
                  sizes.includes(sz)
                    ? "bg-black text-white font-bold"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } px-4 py-1.5 rounded-md cursor-pointer text-xs transition border`}
              >
                {sz}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 items-center mt-2">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
          className="w-4 h-4 cursor-pointer accent-black"
        />
        <label
          className="cursor-pointer text-sm text-gray-700 font-medium select-none"
          htmlFor="bestseller"
        >
          Add to Bestseller collection
        </label>
      </div>

      <button
        disabled={submitting}
        className="w-40 py-3 mt-4 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition cursor-pointer disabled:opacity-50 uppercase tracking-wider shadow-md"
        type="submit"
      >
        {submitting ? "Adding..." : "ADD PRODUCT"}
      </button>
    </form>
  );
};

export default Add;
