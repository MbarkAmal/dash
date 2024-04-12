const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    customer: {
        _id: { type: mongoose.Schema.Types.ObjectId, 
            ref: 'users', 
            required: true 
        },
        username: { type: String, required: true },
        photo_user: {
            data: Buffer,
            contentType: String
        }
    },

    products: [{ 
         _id :{type: mongoose.Schema.Types.ObjectId,
            ref : 'products',
            required : true
         },
         productName : {
            type: String , required: true ,
         },
         price: { type: Number, required: true },

        stock: {
            type:Number,
            required : true ,
        },

         category: {
            type: String,
            required: true,
            enum: ['Dry_fruit', 'Date']
        }

         }],

   
   totalPrice : {
    type: Number,

   },
    status : {
        type : String,
        enum: ['pending', 'delivered' , 'cancelled'],
         default: 'pending'
    },
    createdAt : {
        type : Date,
        default :Date.now
    },
});
module.exports = mongoose.model('orders', orderSchema);