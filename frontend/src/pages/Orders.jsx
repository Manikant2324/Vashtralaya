import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const { products, currency, token, backendUrl, navigate } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const trackOrder = async (orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/track",
        { orderId },
        { headers: { token } }
      );

      if (response.data.success) {
        setSelectedOrder(response.data.order);
        toast.success("Order details loaded");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to track order");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const ORDER_STAGES = [
    "Order Placed",
    "Confirmed",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered"
  ];

  const getStageIndex = (status) => {
    if (status === "Packing") return 2;
    if (status === "Out for delivery") return 4;
    return ORDER_STAGES.indexOf(status);
  };

  return (
    <div className="border-t pt-16">
      <div className="text-2xl mb-8 flex justify-between items-center">
        <Title text1={"MY"} text2={"ORDERS"} />
        <button 
          onClick={fetchOrders}
          className="text-xs border px-3 py-1 text-gray-600 hover:bg-gray-100 rounded"
        >
          Refresh Status
        </button>
      </div>

      {loading && <p className="text-center py-8">Loading orders...</p>}

      {!loading && !token && (
        <div className="text-center py-12 border rounded-lg bg-gray-50 my-6">
          <p className="text-gray-700 font-medium mb-3">Please login to view your order history</p>
          <button 
            onClick={() => navigate("/login")}
            className="bg-black text-white px-6 py-2 text-xs font-semibold rounded hover:bg-gray-800 transition"
          >
            Go to Login
          </button>
        </div>
      )}

      {!loading && token && orders.length === 0 && (
        <p className="text-center py-8 text-gray-600">No orders found</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders List */}
        <div className="lg:col-span-2">
          {orders.map((order, index) => {
            const currentStageIndex = getStageIndex(order.status);
            const isCancelled = order.status === "Cancelled";

            return (
              <div
                key={order._id || index}
                className="py-6 px-4 border rounded-lg text-gray-700 flex flex-col gap-4 mb-6 shadow-sm bg-white"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-2">
                  <div>
                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Order ID:</span>
                    <span className="font-mono text-sm ml-2 text-black font-bold">{order._id}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Date:</span>
                    <span className="text-sm ml-2 text-gray-600">
                      {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Items list */}
                <div className="flex flex-col gap-3">
                  {order.items.map((item, i) => {
                    const matchedProduct = products.find((p) => p._id === item.productId);
                    const itemImage = item.image || (matchedProduct?.image ? matchedProduct.image[0] : "");
                    const itemName = item.name || matchedProduct?.name || "Clothing Item";
                    const itemPrice = item.price || matchedProduct?.price || 0;

                    return (
                      <div key={i} className="flex items-center gap-4 py-2 border-b last:border-b-0">
                        {itemImage ? (
                          <img className="w-16 h-20 aspect-[3/4] object-cover object-top rounded-md border" src={itemImage} alt={itemName} />
                        ) : (
                          <div className="w-16 h-20 aspect-[3/4] bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-400">No Image</div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{itemName}</p>
                          <div className="flex gap-4 text-xs text-gray-500 mt-1">
                            <span>Size: <strong className="text-gray-700">{item.size}</strong></span>
                            <span>Qty: <strong className="text-gray-700">{item.quantity}</strong></span>
                            <span>Price: <strong className="text-gray-700">{currency}{itemPrice}</strong></span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tracking Progress Indicator */}
                <div className="mt-2 pt-4 border-t">
                  <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Status Tracker</p>
                  
                  {isCancelled ? (
                    <div className="bg-red-50 text-red-700 p-3 rounded text-sm font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-600"></span> Order Cancelled
                    </div>
                  ) : (
                    <div className="flex items-center justify-between relative my-2 px-2">
                      {ORDER_STAGES.map((stage, sIdx) => {
                        const isCompleted = currentStageIndex >= sIdx;
                        const isCurrent = currentStageIndex === sIdx;

                        return (
                          <div key={sIdx} className="flex flex-col items-center relative z-10 flex-1">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                isCompleted
                                  ? "bg-black text-white"
                                  : "bg-gray-200 text-gray-500 border border-gray-300"
                              } ${isCurrent ? "ring-4 ring-gray-200" : ""}`}
                            >
                              {sIdx + 1}
                            </div>
                            <p
                              className={`text-[10px] sm:text-xs text-center mt-1.5 font-medium ${
                                isCurrent ? "text-black font-bold" : isCompleted ? "text-gray-700" : "text-gray-400"
                              }`}
                            >
                              {stage}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Order Footer summary */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t text-sm gap-3">
                  <div>
                    <span className="text-gray-500">Total Amount: </span>
                    <span className="text-lg font-bold text-black">{currency}{order.amount}</span>
                    <span className="text-xs text-gray-400 ml-2">({order.paymentMethod?.toUpperCase()})</span>
                  </div>

                  <button
                    onClick={() => trackOrder(order._id)}
                    className="bg-black text-white px-5 py-2 text-xs font-medium rounded hover:bg-gray-800 transition"
                  >
                    View Details & Tracking
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Details Drawer / Side Panel */}
        {selectedOrder && (
          <div className="lg:col-span-1 border rounded-lg p-6 bg-gray-50 h-fit sticky top-24 shadow-md">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="text-lg font-bold text-gray-800">Order Details</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-black font-bold text-lg"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Order ID</p>
                <p className="font-mono text-gray-800 text-xs font-bold mt-0.5">{selectedOrder._id}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Tracking Number</p>
                <p className="font-mono text-green-600 text-sm font-bold mt-0.5">{selectedOrder.trackingNumber}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Current Order Status</p>
                <span className="inline-block mt-1 px-2.5 py-1 rounded text-xs font-bold bg-black text-white">
                  {selectedOrder.status}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Total Amount</p>
                <p className="font-bold text-xl text-black">{currency}{selectedOrder.amount}</p>
                <p className="text-xs text-gray-500">Payment: {selectedOrder.payment ? "Completed" : "Pending (COD)"}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Delivery Address</p>
                <div className="bg-white p-3 rounded border text-xs text-gray-700 leading-relaxed">
                  <p className="font-bold">{selectedOrder.address.firstName} {selectedOrder.address.lastName}</p>
                  <p>{selectedOrder.address.street}</p>
                  <p>{selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.zipcode}</p>
                  <p>{selectedOrder.address.country}</p>
                  <p className="mt-1 text-gray-500">Phone: {selectedOrder.address.phone}</p>
                </div>
              </div>

              {selectedOrder.estimatedDelivery && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Estimated Delivery</p>
                  <p className="font-semibold text-gray-800">{new Date(selectedOrder.estimatedDelivery).toDateString()}</p>
                </div>
              )}

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full mt-4 bg-gray-200 text-gray-800 py-2 rounded text-xs font-semibold hover:bg-gray-300 transition"
              >
                Close Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
