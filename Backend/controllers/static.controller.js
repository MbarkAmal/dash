const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

exports.countOrdersForToday = async (req, res) => {
    try {
      // Get the current date
      const today = new Date();
      
      // Get the start and end of today
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  
      const orderCount = await Order.aggregate([
        {
          $match: {
              status: 'delivered' ,
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
  
      if (orderCount.length === 0) {
        return res.status(200).json({ count: 0, message: 'No orders for today' });
      }
  
      res.status(200).json(orderCount[0]); 
    } catch (error) {
      console.error('Error counting orders for today:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

exports.totalPriceToday = async (req, res) => {
    try {
      const today = new Date () ;
      const startOfDay = new Date (today.getFullYear() , today.getMonth(), today.getDate());
      const endOfDay = new Date (today.getFullYear() , today.getMonth(), today.getDate() +1);
  
      const totalPrice = await Order.aggregate([
        {
          $match: {
            status: 'delivered' ,
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
  
      res.status(200).json(totalPrice);
    } catch (error) {
      console.error('Error counting total price for all months:', error);
      res.status(500).json({ message: ' server error' });
    }
  };

exports.countProductsdelivredForToday = async (req, res) => {
    try {
      const today = new Date();
      
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      const productsCount = await Order.aggregate([
        {
          $match: {
            status: 'delivered',
            createdAt : {
              $gte: startOfDay,
              $lt : endOfDay
            }
            
          }
        },
        {
          $unwind: '$products'
        },
        {
          $group: {
            _id: null ,
            totalProducts: { $sum: '$products.stock' } ,
  
          }
        },
      
     
      ]);
  
      res.status(200).json(productsCount);
    } catch (err) {
      console.error('Error counting products', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

//Orders static

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

  //products static

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

  //count Consumer for today
exports.countConsumerCreatedToday = async (req , res) => {
  try{
    const today = new Date ();
    const startOfDay = new Date (today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date (today.getFullYear() , today.getMonth(), today.getDate() +1);

    const consumerCount = await User.aggregate([
      {
          $match : {
              createdAt : {
                  $gte : startOfDay,
                  $lt: endOfDay
              }
          }
      },
      {
          $group : {
              _id : null ,
              count : {$sum : 1}
          }
      }


    ]);
    res.status(200).json(consumerCount);
  } catch (err) {
      console.error ('error counting consumer created for totday' , err);
      res.status(500).json({message : 'server error '}) ;
  }
}