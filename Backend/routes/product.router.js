// Import required modules
const express = require('express');
const formidable = require('express-formidable');
const productController = require('../controllers/product.controller');

// Create a router instance
const route = express.Router();

// Define a route for creating a product
// Use formidable middleware to parse form data
route.post('/createProduct', formidable(), productController.createProduct);


route.get('/getAllProducts',productController.getAllProducts)

route.delete('/:id',productController.delete)

route.get('/getoneproduct/:id', productController.getoneproduct)

route.get('/productPhoto/:id',productController.productPhoto)

route.put('/Update/:id', formidable() , productController.updateoneproduct)

route.get('/search/:key',productController.search)

// count products Name  in each category
route.get('/countallProductsByCategory', productController.countallProductsByCategory)

module.exports = route 
