import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import productModel from '../models/productModel.js';
import mongoose from 'mongoose';

//all orders data for admin panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, orders: orders || [] });
  } catch (error) {
    console.log("allOrders error:", error);
    res.json({ success: false, message: error.message || "Failed to fetch order details" });
  }
}

const updateStatus = async (req, res) => {
try {
    const {orderId, status} = req.body;
    await orderModel.findByIdAndUpdate(orderId, {status});
    res.json({success:true, message:"Status Updated Successfully"});
} catch (error){
    console.log(error);
    res.json({success:false, message:error.message});
}
}

// Place order
const placeOrder = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;

        if (!userId) {
            return res.json({ success: false, message: "User authentication required. Please login again." });
        }

        const { items, amount, address, paymentMethod } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.json({ success: false, message: "No items found in your order" });
        }

        const orderItems = [];

        // Validate and check stock for all items
        for (let item of items) {
            let product = null;

            if (item.productId && mongoose.Types.ObjectId.isValid(item.productId)) {
                product = await productModel.findById(item.productId);
            }

            // Fallback: If product is not found by ID (e.g. static legacy frontend cart IDs like "aaaaa" or deleted items),
            // attempt to find matching product with available stock in DB
            if (!product || (product.stock !== undefined && product.stock < item.quantity)) {
                const inStockProduct = await productModel.findOne({ stock: { $gte: item.quantity } });
                if (inStockProduct) {
                    product = inStockProduct;
                }
            }

            if (!product) {
                return res.json({ 
                    success: false, 
                    message: "Products in your cart are currently out of stock. Please clear your cart and select items from our latest collection." 
                });
            }

            if (product.stock !== undefined && product.stock < item.quantity) {
                return res.json({ 
                    success: false, 
                    message: `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}` 
                });
            }

            orderItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                image: Array.isArray(product.image) ? product.image[0] : product.image,
                size: item.size || 'M',
                quantity: item.quantity
            });
        }

        // Deduct stock for all items using resolved product IDs
        for (let item of orderItems) {
            await productModel.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -item.quantity } }
            );
        }

        const orderData = {
            userId,
            items: orderItems,
            amount,
            address,
            paymentMethod,
            payment: paymentMethod === 'cod' ? false : true,
            date: new Date(),
            status: 'Order Placed',
            trackingNumber: 'TRK' + Date.now(),
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Clear user cart
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed Successfully", orderId: newOrder._id, trackingNumber: orderData.trackingNumber });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message || "Failed to place order" });
    }
}

// Get user orders
const userOrders = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        if (!userId) {
            return res.json({ success: false, message: "User authentication required" });
        }
        const orders = await orderModel.find({ userId }).sort({ date: -1 });
        res.json({ success: true, orders });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message || "Failed to fetch orders" });
    }
}

// Track order
const trackOrder = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const { orderId } = req.body;

        if (!orderId) {
            return res.json({ success: false, message: "Order ID is required" });
        }

        const order = await orderModel.findById(orderId);
        
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        // Security check: ensure customer only tracks their own order
        if (userId && order.userId.toString() !== userId.toString()) {
            return res.json({ success: false, message: "Access denied. Order belongs to another user." });
        }

        res.json({ success: true, order });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message || "Failed to track order" });
    }
}

export { allOrders, updateStatus, placeOrder, userOrders, trackOrder };