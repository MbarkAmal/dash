const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const fs = require('fs');

exports.createOrder = async (req, res) => {
    const { customerId, products, status } = req.body;

    try {
        // Fetch customer details from the User model using the customerId
        const customer = await User.findById(customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Construct the customer object to be inserted into the order
        const customerDetails = {
            _id: customer._id,
            username: customer.username,
            photo_user: customer.photo_user // Assuming you have photo_user field in your User schema
        };

        // Fetch product details and perform validations
        const productsData = await Promise.all(products.map(async productItem => {
            const product = await Product.findById(productItem.productId);
            if (!product) {
                throw new Error(`Product with ID ${productItem.productId} not found`);
            }

            // Check if enough stock is available for each product
            if (product.stock < productItem.quantity) {
                throw new Error(`Insufficient stock for product with ID ${productItem.productId}`);
            }

            // Update stock for each product
            product.stock -= productItem.quantity;
            await product.save();

            return {
                _id: product._id,
                productName: product.productName,
                price: product.price,
                stock: productItem.quantity,
                category: product.category
            };
        }));

        // Calculate total price
        const totalPrice = productsData.reduce((acc, product) => {
            return acc + (product.price * product.stock);
        }, 0);

        // Create order
        const orderData = {
            customer: customerDetails, // Insert customer details here
            products: productsData,
            totalPrice,
            status: status || 'pending'
        };

        const newOrder = new Order(orderData);
        const savedOrder = await newOrder.save();
        return res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};





/*exports.countOrdersByDay = async (req, res) => {
const mongoose = require('mongoose');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const fs = require('fs');

exports.createOrder = async (req, res) => {
    const { customerId, products, status } = req.body;

    try {
        // Fetch customer details from the User model using the customerId
        const customer = await User.findById(customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Construct the customer object to be inserted into the order
        const customerDetails = {
            _id: customer._id,
            username: customer.username,
            photo_user: customer.photo_user // Assuming you have photo_user field in your User schema
        };

        // Fetch product details and perform validations
        const productsData = await Promise.all(products.map(async productItem => {
            const product = await Product.findById(productItem.productId);
            if (!product) {
                throw new Error(`Product with ID ${productItem.productId} not found`);
            }

            // Check if enough stock is available for each product
            if (product.stock < productItem.quantity) {
                throw new Error(`Insufficient stock for product with ID ${productItem.productId}`);
            }

            // Update stock for each product
            product.stock -= productItem.quantity;
            await product.save();

            return {
                _id: product._id,
                productName: product.productName,
                price: product.price,
                stock: productItem.quantity,
                category: product.category
            };
        }));

        // Calculate total price
        const totalPrice = productsData.reduce((acc, product) => {
            return acc + (product.price * product.stock);
        }, 0);

        // Create order
        const orderData = {
            customer: customerDetails, // Insert customer details here
            products: productsData,
            totalPrice,
            status: status || 'pending'
        };

        const newOrder = new Order(orderData);
        const savedOrder = await newOrder.save();
        return res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

  try {
    // Extract the date from the request query parameters
    const { date } = req.query;

    // Parse the date string into a JavaScript Date object
    const selectedDate = new Date(date);

    // Get the start and end of the selected day
    const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);

    // Aggregate orders by the creation date and count them
    const orderCount = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfDay,
            $lt: endOfDay
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Send the order count in the response
    res.status(200).json(orderCount);
  } catch (error) {
    // If there's an error, return an error response
    console.error('Error counting orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
*/





/*exports.countOrdersForMonth = async (req, res) => {
  try {
    // Get the current date
    const today = new Date();

    // Get the start and end of the current month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Aggregate orders by the creation date and count them for the current month
    const orderCount = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth
          }
        }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 }
        }
      }
    ]);

    // Send the order count for the current month in the response
    res.status(200).json(orderCount[0]); // Assuming orderCount will always have exactly one result
  } catch (error) {
    // If there's an error, return an error response
    console.error('Error counting orders for the month:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};*/





exports.customerPhoto = async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await User.findById(customerId);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    if (customer.photo_user && customer.photo_user.data) {
      // Set the appropriate content type for the response
      res.set('Content-Type', customer.photo_user.contentType);
      // Send the photo data in the response
      return res.status(200).send(customer.photo_user.data);
    } else {
      return res.status(404).json({ success: false, message: 'Photo not found for this customer ID' });
    }
  } catch (err) {
    console.error('Error while getting user photo:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


exports.getAllOrders = (req, res) => {
  Order.find()
    .then(orders => {
      res.status(200).json(orders)
    })

    .catch(error => {
      console.error("Erro fetching orders:" ,error);
      res.status(500).json({ message: "Internal server error"})
    })
  };

exports.delete = async (req, res) => {
  try{
    const id= req.params.id;
    const result = await Order.findByIdAndDelete({_id: id});
    res.status(200).json({message: "Order deleted successfully", result})

  }catch (error) {
    console.error("Erroe deleting order:", error)
    res.status(500).json({message: "Internal server error"})
  }
};

exports.getLastCustomerOrder = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(4);
    if (orders.length > 0) {
      res.status(200).json(orders); // Send the last two orders as JSON response
    } else {
      res.status(404).json({ message: 'No orders found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};






