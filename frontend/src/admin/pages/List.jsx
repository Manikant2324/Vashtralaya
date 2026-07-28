import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../../context/ShopContext";

const List = () => {
  const { adminToken, backendUrl, currency, getProductsData } = useContext(ShopContext);
  const [list, setList] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setLoading(true);
      const response = await axios.get(backendUrl + "/api/product/list");

      if (response.data.success) {
        setList(response.data.products || []);
      } else {
        toast.error(response.data.message || "Failed to fetch product list");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to fetch product list");
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    if (!adminToken) {
      toast.error("Admin authentication required");
      return;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token: adminToken } }
      );
      if (response.data.success) {
        toast.success(response.data.message || "Product removed successfully");
        await fetchList();
        if (getProductsData) await getProductsData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to remove product");
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
    if (!editingProduct || !adminToken) return;

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
        { headers: { token: adminToken } }
      );

      if (response.data.success) {
        toast.success("Product updated successfully!");
        setEditingProduct(null);
        await fetchList();
        if (getProductsData) await getProductsData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update product");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">All Products List</h2>
          <p className="text-xs text-gray-500 mt-1">Manage catalog items, prices, and stock inventory</p>
        </div>
        <button
          onClick={fetchList}
          className="text-xs border px-3 py-1.5 rounded-md hover:bg-gray-100 font-medium"
        >
          Refresh List
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500">Loading catalog items...</p>
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-12 border rounded-xl bg-white">
          <p className="text-gray-500">No products found in catalog</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {/* List Table Header */}
          <div className="hidden md:grid grid-cols-[1fr_2.5fr_1fr_1fr_1fr_1.5fr] items-center py-2.5 px-4 border bg-gray-100 text-xs font-bold uppercase tracking-wider text-gray-700 rounded-t-lg">
            <span>Image</span>
            <span>Name</span>
            <span>Category</span>
            <span>Price</span>
            <span>Stock</span>
            <span className="text-center">Action</span>
          </div>

          {/* Product Rows */}
          {list.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_2fr_1fr] md:grid-cols-[1fr_2.5fr_1fr_1fr_1fr_1.5fr] items-center gap-2 py-3 px-4 border border-gray-200 bg-white rounded-lg text-sm hover:shadow-sm transition"
              key={item._id || index}
            >
              <img
                className="w-14 h-18 aspect-[3/4] object-cover object-top rounded-md border"
                src={Array.isArray(item.image) ? item.image[0] : item.image}
                alt="product_image"
              />
              <p className="font-medium text-gray-800 line-clamp-1">{item.name}</p>
              <p className="text-gray-600 text-xs">{item.category}</p>
              <p className="font-semibold text-gray-900">{currency}{item.price}</p>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold inline-block w-fit ${item.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {item.stock !== undefined ? item.stock : 100}
              </span>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => handleEditClick(item)}
                  className="bg-black text-white text-xs px-3 py-1.5 rounded hover:bg-gray-800 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeProduct(item._id)}
                  className="text-red-600 hover:text-red-800 font-bold text-xs px-2 py-1"
                  title="Delete Product"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-gray-800">Edit Product</h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-black font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold mb-1">Product Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg text-sm min-h-[80px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Stock Qty</label>
                  <input
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg text-sm"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Sub Category</label>
                  <select
                    value={editSubCategory}
                    onChange={(e) => setEditSubCategory(e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg text-sm"
                  >
                    <option value="Topwear">Topwear</option>
                    <option value="Bottomwear">Bottomwear</option>
                    <option value="Winterwear">Winterwear</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="editBestseller"
                  checked={editBestseller}
                  onChange={(e) => setEditBestseller(e.target.checked)}
                  className="w-4 h-4 accent-black cursor-pointer"
                />
                <label htmlFor="editBestseller" className="cursor-pointer font-medium text-gray-700">
                  Bestseller product
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-xs border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
