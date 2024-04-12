const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
    },
    price: {
        type: Number,
    },
    weight: {
        type: String,
    },
    stock: {
        type: Number,
        default: 0,
    },
    photo: {
        data: Buffer,
        contentType: String,
    },
    category: {
        type: String,
        enum: ['Dry_fruit', 'Date'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

// Conditional getter for stock status
productSchema.virtual('stockStatus').get(function() {
    return this.stock === 0 || this.stock === 'false' ? 'Out of stock' : this.stock.toString();
});

module.exports = mongoose.model('products', productSchema);
