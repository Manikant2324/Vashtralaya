import orderModel from '../models/orderModel.js';


//all orders data for admin panel
const allOrders = async (req, res) => {
 try {
   const orders = await orderModel.find({});
   res.json({success:true,orders})

 } catch (error){
    console.log(error);
    res.json({success:false, message:error.message});
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

export { allOrders, updateStatus };