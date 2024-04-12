/*const {response} = require('express')*/
const Product = require ('../models/Product')
const fs = require('fs');

exports.createProduct = (req, res) => {
    const { productName, price, weight, stock, category } = req.fields; // Destructure fields from req.fields
    const { photo } = req.files; // Assuming 'photo' is the name of the file input in your form

    let stockValue; // Declare stockValue variable

    if (stock === 'true') {
        // If stock is true, extract the stock quantity from the request fields
        stockValue = parseInt(req.fields.stockQuantity);
    } else {
        // If stock is false, set stockValue to 0
        stockValue = 0;
    }

    const data = {
        productName: productName,
        price: price,
        weight: weight,
        stock: stockValue, // Assign stockValue
        category: category,
        photo: photo,
    };

    const _product = new Product(data);

    if (photo) {
        // If a photo is provided, read the photo file and set its data and content type to the product object
        _product.photo.data = fs.readFileSync(photo.path);
        _product.photo.contentType = photo.type;
    }

    _product.save()
        .then(createdProduct => {
            // If product creation is successful, send a success response
            res.status(200).json({ message: "Product added successfully" });
        })
        .catch(err => {
            // If there's an error, send an error response
            console.error("Error while adding product:", err);
            res.status(400).json({ message: "Problem while adding product" });
        });
};



exports.updateoneproduct = async (req, res) => {
    try {
        const { productName, price, weight, stock, category } = req.fields;
        const { photo } = req.files;
        
        const updateData = {
            productName,
            price,
            weight,
            stock,
            category,
            photo,
        };

        if (photo) {
            updateData.photo = {
                data: fs.readFileSync(photo.path),
                contentType: photo.type
            };
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error("Error while updating product:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};



exports.getAllProducts = (req, res) => {
    // Fetch all products from the database
    Product.find().select()
        .then(products => {
            // If products are found, send them in the response
            res.status(200).json(products)
            
        })
        .catch(error => {
            // If there's an error, send an error response
            console.error("Error fetching products:", error);
            res.status(500).json({ message: "Internal server error" });
        });
};



exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Product.findByIdAndDelete({ _id: id });
        res.status(200).json({ message: "Product deleted successfully", result });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getoneproduct = async (req , res )=>{
    try {
        
    const result = await Product.findOne({ _id: req.params.id});
    
        res.status(200).json({ result });
    }catch(error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


exports.search = async (req, res) => {
    try {
        const key = req.params.key;
        const results = await Product.find({
            $or: [
                { productName:  {$regex : req.params.key} }, // Case-insensitive search for productName
                { category: {$regex: req.params.key } },    // Case-insensitive search for category
            ]
        });

        res.send(results);
    } catch (error) {
        console.error('Error searching for products:', error);
        res.status(500).send('Internal Server Error');
    }
}


exports.productPhoto = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).select("photo");
        
        if (!product) {
            return res.status(404).send({ success: false, message: "Product not found" });
        }

        if (product.photo && product.photo.data) {
            res.set("Content-Type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
        } else {
            return res.status(404).send({ success: false, message: "Photo not found for this product" });
        }
    } catch (error) {
        console.error("Error while getting product photo:", error);
        res.status(500).send({ success: false, message: "Internal server error" });
    }
};


//count all products by  category  for month
exports.countallProductsByCategory = async( req , res) =>{
    try{
        const allproducts = await Product.aggregate([
            
            {
                $group: {
                    _id: {
                        category: '$category',
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    numberofproducts: { $sum: 1 }
                }
            },
            {
            $project: {
                _id :0,
                category : '$_id',
                numberofproducts :1
            }
        },
        
        ]);
        res.status(200).json(allproducts);
  } catch (err) {
    console.error('Error counting products by category', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}