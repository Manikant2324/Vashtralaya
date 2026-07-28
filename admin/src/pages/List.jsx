import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // Edit form states
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editCategory, setEditCategory] = useState("Men");
  const [editSubCategory, setEditSubCategory] = useState("Topwear");
  const [editBestseller, setEditBestseller] = useState(false);
  const [editSizes, setEditSizes] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");

      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleEditClick = (item) => {
    setEditingProduct(item);
    setEditName(item.name || "");
    setEditDescription(item.description || "");
    setEditPrice(item.price || "");
    setEditStock(item.stock !== undefined ? item.stock : 100);
    setEditCategory(item.category || "Men");
    setEditSubCategory(item.subCategory || "Topwear");
    setEditBestseller(item.bestseller || false);
    setEditSizes(item.sizes || []);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const updateData = {
        productId: editingProduct._id,
        name: editName,
        description: editDescription,
        price: editPrice,
        stock: editStock,
        category: editCategory,
        subCategory: editSubCategory,
        bestseller: editBestseller,
        sizes: editSizes,
      };

      const response = await axios.post(
        backendUrl + "/api/product/update",
        updateData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Product updated successfully!");
        setEditingProduct(null);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to update product");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-4 font-semibold text-lg text-gray-700">All Products List</p>

      <div className="flex flex-col gap-2">
        {/* ------ List Table Title--------- */}
        <div className="hidden md:grid grid-cols-[1fr_2.5fr_1fr_1fr_1fr_1.5fr] items-center py-2 px-3 border bg-gray-100 text-xs font-bold uppercase tracking-wider text-gray-700">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Stock</b>
          <b className="text-center">Actions</b>
        </div>

        {/* ------ Product List--------- */}
        {list.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_2fr_1fr] md:grid-cols-[1fr_2.5fr_1fr_1fr_1fr_1.5fr] items-center gap-2 py-2 px-3 border text-sm hover:bg-gray-50 transition"
            key={index}
          >
            <img className="w-14 h-18 aspect-[3/4] object-cover object-top rounded-md border" src={item.image[0]} alt="product_image" />
            <p className="font-medium text-gray-800">{item.name}</p>
            <p className="text-gray-600">{item.category}</p>
            <p className="font-semibold text-gray-800">{currency}{item.price}</p>
            <span className={`px-2 py-0.5 rounded text-xs font-bold inline-block w-fit ${item.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {item.stock !== undefined ? item.stock : 100}
            </span>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => handleEditClick(item)}
                className="bg-black text-white text-xs px-3 py-1 rounded hover:bg-gray-800 transition"
              >
                Edit
              </button>
              <button
                onClick={() => removeProduct(item._id)}
                className="text-red-500 hover:text-red-700 font-bold px-2 py-1"
                title="Delete Product"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-gray-800">Edit Product: {editingProduct.name}</h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-black font-bold text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Product Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border px-3 py-2 rounded text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full border px-3 py-2 rounded text-sm min-h-20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full border px-3 py-2 rounded text-sm"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Sub Category</label>
                  <select
                    value={editSubCategory}
                    onChange={(e) => setEditSubCategory(e.target.value)}
                    className="w-full border px-3 py-2 rounded text-sm"
                  >
                    <option value="Topwear">Topwear</option>
                    <option value="Bottomwear">Bottomwear</option>
                    <option value="Winterwear">Winterwear</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Price ({currency})</label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full border px-3 py-2 rounded text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="w-full border px-3 py-2 rounded text-sm"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-2">Sizes</label>
                <div className="flex gap-2">
                  {["S", "M", "L", "XL", "XXL"].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() =>
                        setEditSizes((prev) =>
                          prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
                        )
                      }
                      className={`px-3 py-1 text-xs border rounded ${
                        editSizes.includes(sz) ? "bg-black text-white font-bold" : "bg-gray-100"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="editBestseller"
                  checked={editBestseller}
                  onChange={(e) => setEditBestseller(e.target.checked)}
                />
                <label htmlFor="editBestseller" className="text-xs font-semibold cursor-pointer">
                  Mark as Bestseller
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-xs border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs bg-black text-white rounded hover:bg-gray-800 font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default List;