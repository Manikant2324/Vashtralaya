import express from 'express';
import adminAuth from '../middleware/adminAuth.js';


import {allOrders,updateStatus } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);


export default orderRouter;