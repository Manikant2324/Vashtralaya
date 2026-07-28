import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../../context/ShopContext";
import { assets } from "../../assets/frontend-assests/assets";

const Order = () => {
  const { adminToken, backendUrl, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchAllOrders = async () => {
    if (!adminToken) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token: adminToken } }
      );

      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        toast.error(response.data.message || "Failed to fetch order details");
      }
    } catch (error) {
      console.error("Order fetch error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch order details"
      );
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    if (!adminToken) return;
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { token: adminToken } }
      );
      if (response.data.success) {
        toast.success("Order status updated successfully");
        await fetchAllOrders();
      } else {
        toast.error(response.data.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update status"
      );
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [adminToken]);

  return (
    <div className="p-2 sm:p-4 max-w-7xl mx-auto animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Order Management
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            View, track and update customer orders in real-time
          </p>
        </div>
        <button
          onClick={fetchAllOrders}
          className="px-4 py-2 text-xs sm:text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-100 transition shadow-sm bg-white"
        >
          Refresh Orders
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-600 font-medium">No customer orders found</p>
          <p className="text-xs text-gray-400 mt-1">
            New customer orders will appear here automatically
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => {
            const address = order.address || {};
            const items = order.items || [];
            const customerName =
              (address.firstName || "") + " " + (address.lastName || "");

            return (
              <div
                key={order._id || index}
                className="grid grid-cols-1 md:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-4 items-start border border-gray-200 rounded-xl p-5 sm:p-6 bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-center p-2 bg-gray-50 rounded-lg w-12 h-12">
                  <img
                    className="w-8 h-8 object-contain"
                    src={assets.quality_icon || assets.search_icon}
                    alt="Parcel Icon"
                  />
                </div>

                {/* Items & Customer Info */}
                <div className="space-y-2">
                  <div className="font-semibold text-sm text-gray-800">
                    {items.map((item, i) => (
                      <p key={i} className="py-0.5">
                        {item.name || "Item"} x {item.quantity}{" "}
                        {item.size && (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-mono ml-1">
                            {item.size}
                          </span>
                        )}
                      </p>
                    ))}
                  </div>

                  <p className="text-xs font-bold text-gray-900 mt-2">
                    {customerName.trim() ? customerName : "Customer"}
                  </p>

                  <div className="text-xs text-gray-500 leading-relaxed">
                    <p>{address.street || ""}</p>
                    <p>
                      {[address.city, address.state, address.zipcode, address.country]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    {address.phone && (
                      <p className="mt-1 font-mono text-gray-600">
                        📞 {address.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Metadata */}
                <div className="text-xs text-gray-600 space-y-1">
                  <p className="font-semibold text-gray-800">
                    Items: {items.length}
                  </p>
                  <p>Method: <span className="uppercase font-medium">{order.paymentMethod || "COD"}</span></p>
                  <p>
                    Payment:{" "}
                    <span
                      className={`font-semibold ${
                        order.payment ? "text-green-600" : "text-amber-600"
                      }`}
                    >
                      {order.payment ? "Done" : "Pending"}
                    </span>
                  </p>
                  <p className="text-gray-400 text-[11px] mt-1">
                    {order.date ? new Date(order.date).toLocaleString() : ""}
                  </p>
                </div>

                {/* Amount */}
                <div>
                  <p className="text-base sm:text-lg font-bold text-gray-900">
                    {currency}
                    {order.amount}
                  </p>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800 underline block"
                  >
                    View Details
                  </button>
                </div>

                {/* Status Selector */}
                <div>
                  <select
                    onChange={(event) => statusHandler(event, order._id)}
                    value={order.status || "Order Placed"}
                    className="w-full p-2 text-xs sm:text-sm font-semibold border rounded-lg bg-gray-50 border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 font-bold text-xl"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">
              Order Details
            </h3>

            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">
                  Order ID
                </p>
                <p className="font-mono text-xs font-bold text-black mt-0.5">
                  {selectedOrder._id}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">
                  Tracking Number
                </p>
                <p className="font-mono text-sm font-bold text-green-700 mt-0.5">
                  {selectedOrder.trackingNumber || "N/A"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">
                    Status
                  </p>
                  <span className="inline-block mt-1 px-2.5 py-1 text-xs font-bold rounded bg-black text-white">
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">
                    Total Amount
                  </p>
                  <p className="font-bold text-lg text-black">
                    {currency}
                    {selectedOrder.amount}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                  Purchased Items
                </p>
                <div className="space-y-2 border rounded-lg p-3 bg-gray-50">
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1 border-b last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-15 aspect-[3/4] object-cover object-top rounded-md border"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-gray-500">
                            Size: {item.size} | Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-gray-800">
                        {currency}
                        {item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
                  Shipping Address
                </p>
                <div className="p-3 bg-gray-50 rounded-lg text-xs space-y-0.5 border">
                  <p className="font-bold text-gray-900">
                    {selectedOrder.address?.firstName}{" "}
                    {selectedOrder.address?.lastName}
                  </p>
                  <p>{selectedOrder.address?.street}</p>
                  <p>
                    {selectedOrder.address?.city},{" "}
                    {selectedOrder.address?.state}{" "}
                    {selectedOrder.address?.zipcode}
                  </p>
                  <p>{selectedOrder.address?.country}</p>
                  <p className="text-gray-500 mt-1">
                    Phone: {selectedOrder.address?.phone}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full bg-black text-white py-2.5 rounded-lg text-xs font-semibold hover:bg-gray-800 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
