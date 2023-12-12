
const OrderS = require("../services/order/order");
const order_validator = require("../validation/order_validator");
const CancellationS = require("../services/order/cancellation");
const RatingS = require("../services/product/rating");


class Order{

    async createOrder(req,res){
        try {
            const {userId} = req.user;
            const validatedData = order_validator.validate(req.body)
            const result = await OrderS.createOrder({data:validatedData,userId})
            if(result){
                res.status(200).json({success:true,data:result})
            }else{
                throw new Error("Failed to place order")
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success:false,
                error:error.message
            })
        
        }
    }
    async orderPaymentMethod(req,res){
        try {
            const {userId} = req.user;
            const {method,orderId} = req.body;
            if(method!=='COD'){
                throw new Error("Payment method not supported")
            }else{
                const result = await OrderS.setPaymentMethodCOD({userId,orderId})
                if(result){
                    res.status(200).json({success:true,data:result})
                }else{
                    throw new Error("Failed to choose payment method COD")
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success:false,
                error:error.message
            })
        
        }
    }

    async getRecentOrder(req,res){
        try {
            const {userId} = req.user;
            const result = await OrderS.getRecentOrder({userId})
            res.status(200).json({success:true,data:result})
        } catch (error) {
            res.status(500).json({
                success:false,
                error:error.message
            })
        }
    }
    async getAllOrders(req,res){
        try {
            const {userId} = req.user;
            const result = await OrderS.getAllOrders({userId})
            res.status(200).json({success:true,data:result})
        } catch (error) {
            res.status(500).json({
                success:false,
                error:error.message
            })
        }
    }
    async getOrderDetailsById(req,res){
        try {
            const {userId} = req.user;
            const {orderId} = req.query;
            let result = await OrderS.getOrderDetailsById({userId,orderId})
            const cancellation = await CancellationS.getCancellationByOrderId({orderId,userId})??[]
           const reviews = await RatingS.getRateByuserId({userId,orderId})
            console.log(reviews);
            
            res.status(200).json({success:true,data:{...result._doc,cancellation,reviews}})
        } catch (error) {
            res.status(500).json({
                success:false,
                error:error.message
            })
        }
    }

}

const OrderController = new Order()
module.exports = OrderController;