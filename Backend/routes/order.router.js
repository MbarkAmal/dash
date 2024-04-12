const express = require('express');
const router = express.Router();
const userOrder  = require('../controllers/order.controller');
const formidable = require('express-formidable');
const { useReducer } = require('react');

// Define a route to create a new order
router.post('/createOrder', userOrder.createOrder);

router.get('/getallOrders', userOrder.getAllOrders);

router.delete('/deleteOrder/:id',userOrder.delete);

router.get('/getphoto/:id',userOrder.customerPhoto);

router.get('/getlastcustomerorder',userOrder.getLastCustomerOrder)

//router.get('/orderbyday',userOrder.countOrdersByDay)

router.get('/countorder',userOrder.countOrdersForToday);

router.get ('/countformonth',userOrder.countOrdersForMonth);

router.get('/counttotalpricefortoday',userOrder.totalPriceToday);

router.get('/countorderbyStatus' , userOrder.countOrdersByStatus);

router.get('/productsSellersCount', userOrder.countProductsSellersforMonth);// update *
//update*
//router.get ('/countproductsbyStatus', userOrder.countProductsByStatus);

router.get('/countproductssellersbyCategory',userOrder.countDeliveredProductsByCategory); //globale

router.get('/totalPriceForWeekMonthYear', userOrder.totalPriceForWeekMonthYear);

router.get('/totalpriceinCategory' ,userOrder.totalPriceInCategoryForWeekMonthYear)

module.exports = router;
