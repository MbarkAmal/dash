import React, { useState } from 'react';
import axios from 'axios'

import './AddProduct.scss';
import toast, { Toaster } from 'react-hot-toast';
import Sidebar from '../../Components/SideBar Section/Sidebar';
import { BiSearchAlt } from 'react-icons/bi';
import { TbMessageCircle } from 'react-icons/tb';
import { IoNotificationsOutline } from 'react-icons/io5';
import img from '../../../src/Assets/img.jpg';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addProduct } from '../../redux/productSlice';

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [photo , setPhoto] = useState('');
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch()

  const navigate = useNavigate();
  const validateForm = () => {
    const errors = {};

    if (!productName.trim()) {
      errors.productName = 'Product name is required';
    }

    if (!price.trim()) {
      errors.price = 'Price is required';
    } else if (isNaN(price)) {
      errors.price = 'Price must be a number';
    }

    if (!weight.trim()) {
      errors.weight = 'Weight is required';
    }

    if (!category.trim()) {
      errors.category = 'Category is required';
    }

    if (!stock.trim()) {
      errors.stock = 'Stock is required';
    } else if (isNaN(stock)) {
      errors.stock = 'Stock must be a number';
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };



  const createProd = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const formData = new FormData(); // Create FormData object

  // Append form data to FormData object
  formData.append('productName', productName);
  formData.append('price', parseFloat(price));
  formData.append('weight', weight);
  formData.append('stock', parseInt(stock));
  formData.append('category', category);
  formData.append('photo', photo);

  console.log(formData);
    try {
      const response = await axios.post('http://localhost:4000/Products/createProduct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Set content type to multipart/form-data
        }
      });

      dispatch(addProduct(response.data)); // Dispatch only the response data
      toast.success('Product created');
      console.log('result',response)
      setProductName('');
      setPrice('');
      setWeight('');
      setCategory('');
      setStock('');
      navigate('/Product');
    } catch (err) {
      console.log(err);
      toast.error('Creation failed');
    }
};

 
  return (
    <div className="container">
      <Sidebar />
      <Toaster />
      <div className="mainContent">
        <div className="topSection">
          <div className="headerSection flex">
            <div className="title">
              <h1>Welcome to ....</h1>
              <p>Hello Admin, Welcome back!</p>
            </div>
            <div className="searchBar flex">
              <input type="text" placeholder="Search Dashboard"/>
              <BiSearchAlt className="icon" />
            </div>
            <div className="adminDiv flex ">
              <TbMessageCircle className="icon" />
              <IoNotificationsOutline className="icon" />
              <div className="adminImage">
                <img src={img} alt="Admin Image" />
              </div>
            </div>
          </div>
        </div>

        <div className="formContent flex">
          <h2>Add Product</h2>
        </div>

        <form onSubmit={createProd} className="formSection">
          <div className="row">
            <div className="col-25">
              <label htmlFor="productName">Product</label>
            </div>
            <div className="col-75">
              <input
                type="text"
                placeholder="Product name.."
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              {errors.productName && <p className="error">{errors.productName}</p>}
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <label htmlFor="price">Price</label>
            </div>
            <div className="col-75">
              <input
                type="text"
                placeholder="Price..."
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              {errors.price && <p className="error">{errors.price}</p>}
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <label htmlFor="weight">Weight</label>
            </div>
            <div className="col-75">
              <input
                type="text"
                placeholder="Weight..."
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              {errors.weight && <p className="error">{errors.weight}</p>}
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <label htmlFor="category">Category</label>
            </div>
            <div className="col-75">
              <select
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select category</option>
                <option value="Dry_fruit">Dry Fruits</option>
                <option value="Date">Dates</option>
              </select>
              {errors.category && <p className="error">{errors.category}</p>}
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <label htmlFor="stock">Stock</label>
            </div>
            <div className="col-75">
              <input
                type="text"
                placeholder="Stock.."
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
              {errors.stock && <p className="error">{errors.stock}</p>}
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <label htmlFor="photo">Image</label>
            </div>
            <div className="col-75">
              <input type="file" accept="image/*" 
              onChange={(e) => setPhoto(e.target.files[0])}  />
            </div>
          </div>
          <div className="row">
          <div className="col-25">
          <label htmlFor="photo">Image</label>
         </div>
          <div className="col-75">

    {photo && (
        <img src={URL.createObjectURL(photo)} alt="Uploaded" 
        style={{ width: '170px', height: '190px', display: 'flex', borderRadius: '10px' }} />
    )}
       </div>

          </div>
          <div className="buttons flex">
            <button className="btn" type="submit">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;

