import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import userAuth from '../middleware/userAuth.js';

import {allOrders, updateStatus, placeOrder, userOrders, trackOrder } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);
orderRouter.post('/place', userAuth, placeOrder);
orderRouter.post('/userorders', userAuth, userOrders);
orderRouter.post('/track', userAuth, trackOrder);

export default orderRouter;