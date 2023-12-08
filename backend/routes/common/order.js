const OrderController = require("../../controller/order");
const { AuthenticationToken } = require("../../middleware/authToken");

const app = require("express").Router()

app.post('/',AuthenticationToken,OrderController.createOrder)
app.patch('/payment',AuthenticationToken,OrderController.orderPaymentMethod)
app.get('/recent',AuthenticationToken,OrderController.getRecentOrder)
app.get('/',AuthenticationToken,OrderController.getAllOrders)
app.get('/orderdetails',AuthenticationToken,OrderController.getOrderDetailsById)
module.exports = app;