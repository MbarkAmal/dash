const express = require('express');
const router = express.Router();
const userOrder  = require('../controllers/order.controller');
const formidable = require('express-formidable');
//const { useReducer } = require('react');

// Define a route to create a new order
router.post('/createOrder', userOrder.createOrder);

router.get('/getallOrders', userOrder.getAllOrders);

router.delete('/deleteOrder/:id',userOrder.delete);

router.get('/getphoto/:id',userOrder.customerPhoto);

router.get('/getlastcustomerorder',userOrder.getLastCustomerOrder);

router.get('/getorderdetailbyid/:id',userOrder.getOrderDetailByID);

router.put('/updateStatus/:id', userOrder.updateStatusOrder)

//router.get('/orderbyday',userOrder.countOrdersByDay)

module.exports = router;
