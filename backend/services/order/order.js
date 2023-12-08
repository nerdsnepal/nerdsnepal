const { generateProductSignature } = require("../../common/utils");
const Order = require("../../models/orders");
const UserS = require("../user/user_service");


class OrderService {

     createOrder= async({data,userId}) =>{
        return await  Order({
            ...data,
            userId,
            signature:generateProductSignature(data.products,userId)
        }).save();
    }
    setPaymentMethodCOD = async ({userId,orderId})=>{
       const result = await Order.findOne({_id:orderId,userId:userId})
        if(result.paymentMethod==='None'){
            result.paymentMethod='Cash on Delivery';
        }else{
            throw new Error(`You have chosen ${result.paymentMethod} as your payment method and the payment status is ${result.paymentStatus}.`)
        }
        return result.save();
        
    }
    getRecentOrder = async({userId})=>{
        return await Order.find({userId,paymentMethod:{
            $ne:"None"
        }}).sort({createdAt: -1}).limit(3)
    }
    getAllOrders = async ({userId})=>{
        return   await Order.find({userId,paymentMethod:{
            $ne:"None"
        }}).sort({createdAt: -1})
    }
    getOrderDetailsById= async({userId,orderId})=>{
        let order= await Order.findOne({_id:orderId,userId})
        .populate("userId","_id name username profile email")
        .populate("storeId","_id logo name");
        return order
    }

}
const OrderS = new OrderService()
module.exports = OrderS;