const express = require ('express') ;
const router = express.Router();

const OrderStatic = require ('../controllers/static.controller');

router.get('/countorderdeliveredfortoday',OrderStatic.countOrdersForToday); //+ *

router.get('/counttotalpricefortoday',OrderStatic.totalPriceToday);//+ *

router.get('/countproductsdeliveredfortoday', OrderStatic.countProductsdelivredForToday);// + *

router.get ('/countformonth',OrderStatic.countOrdersForMonth); //*

router.get('/countorderbyStatus' , OrderStatic.countOrdersByStatus);//*

router.get('/totalPriceForWeekMonthYear', OrderStatic.totalPriceForWeekMonthYear);//*

router.get('/countproductssellersbyCategory',OrderStatic.countDeliveredProductsByCategory); //globale *

router.get('/totalpriceinCategory' ,OrderStatic.totalPriceInCategoryForWeekMonthYear)//*

router.get ('/countconsumercreatedfortoday' ,OrderStatic.countConsumerCreatedToday)

module.exports = router ;