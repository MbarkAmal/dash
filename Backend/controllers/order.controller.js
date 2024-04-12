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


exports.countOrdersForToday = async (req, res) => {
  try {
    // Get the current date
    const today = new Date();
    
    // Get the start and end of today
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Aggregate orders by the creation date and count them for today
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
          _id: null,
          count: { $sum: 1 }
        }
      }
    ]);

    // Check if there are no orders for today
    if (orderCount.length === 0) {
      return res.status(200).json({ count: 0, message: 'No orders for today' });
    }

    // Send the order count for today in the response
    res.status(200).json(orderCount[0]); // Assuming orderCount will always have exactly one result
  } catch (error) {
    // If there's an error, return an error response
    console.error('Error counting orders for today:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


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

exports.countOrdersForMonth = async (req, res) => {
  try {
    // Aggregate delivered orders by the creation date and count them for all months
    const deliveredOrderCount = await Order.aggregate([
      {
        $match: {
          status: 'delivered' // Filter orders by status 'delivered'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Send the delivered order count for all months in the response
    res.status(200).json(deliveredOrderCount);
  } catch (error) {
    // If there's an error, return an error response
    console.error('Error counting delivered orders for all months:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.totalPriceToday = async (req, res) => {
  try {
    const today = new Date () ;
    const startOfDay = new Date (today.getFullYear() , today.getMonth(), today.getDate());
    const endOfDay = new Date (today.getFullYear() , today.getMonth(), today.getDate() +1);

    // Aggregate orders by the creation date and sum their total price for all months
    const totalPriceByMonth = await Order.aggregate([
      {
        $match: {
          status: 'delivered' ,// Filter orders by status 'delivered'
          createdAt: {
            $gte: startOfDay,
            $lt: endOfDay
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' }
        }
      }
    ]);

    // Send the total price for all months in the response
    res.status(200).json(totalPriceByMonth);
  } catch (error) {
    // If there's an error, return an error response
    console.error('Error counting total price for all months:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// total price of all orders delevred for each category  
//exports.totalPrice


// Define a function to count orders by status
exports.countOrdersByStatus = async (req, res) => {
  try {
      // Aggregate pipeline to group orders by status and count them
      const orderCounts = await Order.aggregate([
          {
              $group: {
                  _id: '$status', // Group by status field
                  count: { $sum: 1 } // Count documents in each group
              }
          }
      ]);

      // Send the aggregated results as a response
      res.json(orderCounts);
  } catch (error) {
      console.error('Error counting orders by status:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};



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


// Aggregate products sellers for Month 
exports.countProductsSellersforMonth = async (req, res) => {
  try {
    const productsCount = await Order.aggregate([
      {
        $match: {
          status: 'delivered' // Filter orders by status 'delivered'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalProducts: { $sum: { $size: "$products" } } // Count total products in all orders for each month
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalProducts: 1
        }
      }
    ]);

    res.status(200).json(productsCount);
  } catch (err) {
    console.error('Error counting products', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//Aggregate  products  by status
//*
exports.countProductsByStatus = async (req, res) => {
  try {
    const productsCount = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          totalProducts: { $sum: { $size: "$products" } } // Count total products for each status
        }
      },
      {
        $project: {
          _id: 0,
          status: '$_id', // Rename _id field to status
          totalProducts: 1
        }
      }
    ]);
    
    res.status(200).json(productsCount);
  } catch (err) {
    console.error('Error counting products', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};





// total price of all orders delivered 
exports.totalPriceForWeekMonthYear = async (req, res) => {
  try {
    const { type } = req.query;
    let aggregationPipeline;

    switch (type) {
      case 'Week':
        aggregationPipeline = [
          {
            $match: {
              status: 'delivered' // Filter orders by status 'delivered'
            }
          },
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' }, // Extract year from createdAt field
                week: { $isoWeek: '$createdAt' } // Extract week from createdAt field
              },
              total: { $sum: '$totalPrice' } // Calculate total price for each week
            }
          }
        ];
        break;
      case 'Month':
        aggregationPipeline = [
          {
            $match: {
              status: 'delivered' // Filter orders by status 'delivered'
            }
          },
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' }, // Extract year from createdAt field
                month: { $month: '$createdAt' } // Extract month from createdAt field
              },
              total: { $sum: '$totalPrice' } // Calculate total price for each month
            }
          }
        ];
        break;
      case 'Year':
        aggregationPipeline = [
          {
            $match: {
              status: 'delivered' // Filter orders by status 'delivered'
            }
          },
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' } // Extract year from createdAt field
              },
              total: { $sum: '$totalPrice' } // Calculate total price for each year
            }
          }
        ];
        break;
      default:
        res.status(400).json({ message: 'Invalid type parameter' });
        return;
    }

    // Aggregate orders based on the selected type
    const totalPrice = await Order.aggregate(aggregationPipeline);

    // Send the total prices for the selected type in the response
    res.status(200).json({ totalPrice });
  } catch (error) {
    // If there's an error, return an error response
    console.error('Error counting total price:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


//nbr of products sellers in each category 

//count  all products sellers by category : nbr  work
exports.countDeliveredProductsByCategory = async (req, res) => {
  try {
    
    // Aggregate the products by category and sum up the stock for the current month
    const productsCount = await Order.aggregate([
      { 
        $match: {
          status: 'delivered',
        }
      },
      {
        $unwind: '$products'
      },
      {
        $group: {
          _id: {
            category : '$products.category',
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          productssellers: { $sum: '$products.stock' }
        }
      },

      {
        $project: {
            _id :0,
            category : '$_id',
            productssellers :1
        }
      },
    ]);

    res.status(200).json(productsCount);
  } catch (err) {
    console.error('Error counting products', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// total price of all orders  in each category for week month and year 

exports.totalPriceInCategoryForWeekMonthYear = async (req, res) => {
  try {
    const { type } = req.query;
    let aggregationPipeline;
    
    switch (type) {
      case 'Week':
        aggregationPipeline = [
          { 
            $match: {
              status: 'delivered',
            }
          },
          {
            $unwind: '$products'
          },
          {
            $group: {
              _id: {
                category: '$products.category',
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
              },
              totalStock: { $sum: '$products.stock' },
              totalPrice: { $sum: { $multiply: ['$products.stock', '$products.price'] } }
            }
          }
        ];
        break;
      case 'Month':
        aggregationPipeline = [
          { 
            $match: {
              status: 'delivered',
            }
          },
          {
            $unwind: '$products'
          },
          {
            $group: {
              _id: {
                category: '$products.category',
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
              },
              totalStock: { $sum: '$products.stock' },
              totalPrice: { $sum: { $multiply: ['$products.stock', '$products.price'] } }
            }
          }
        ];
        break;
      case 'Year':
        aggregationPipeline = [
          { 
            $match: {
              status: 'delivered',
            }
          },
          {
            $unwind: '$products'
          },
          {
            $group: {
              _id: {
                category: '$products.category',
                year: { $year: '$createdAt' },
              },
              totalStock: { $sum: '$products.stock' },
              totalPrice: { $sum: { $multiply: ['$products.stock', '$products.price'] } }
            }
          }
        ];
        break;
      default:
        res.status(400).json({ message: 'Invalid type parameter' });
        return;
    }
   
    // Aggregate the products by category and sum up the stock and total price for the current month
    const totalPricesByCategory = await Order.aggregate(aggregationPipeline);
    res.status(200).json({ totalPricesByCategory });
  } catch (err) {
    console.error('Error counting products', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}


