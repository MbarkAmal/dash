import React, { useEffect, useState } from "react";
import axios from 'axios'

import Sidebar from '../../Components/SideBar Section/Sidebar';
import { useParams ,useNavigate } from "react-router-dom";


import { BiSearchAlt } from 'react-icons/bi';
import { TbMessageCircle } from 'react-icons/tb';
import { IoNotificationsOutline } from 'react-icons/io5';
import img from '../../../src/Assets/img.jpg';
import { useDispatch, useSelector } from "react-redux";
import { updateProduct } from "../../redux/productSlice";

const Update = () => {
  const {id} =useParams ()
  const products = useSelector (state => state.products.products)
  const product = products.find (p => p.id === id )
  console.log(product)

  const [productName, setProductName] = useState('')
  const [price, setPrice] = useState('')
  const [weight, setWeight] = useState('')
  const [stock, setStock] = useState('')
  const [category, setCategory] = useState('')
  const [photo, setPhoto] = useState('')
  const navigate = useNavigate();

  const getSingleProduct = async (id) => {
    try {
      const { data } = await axios.get(`http://localhost:4000/Products/getoneproduct/${id}`);
      const { productName, price, weight, stock, category , photo } = data.result;
      setProductName(productName);
      setPrice(price);
      setWeight(weight);
      setStock(stock);
      setCategory(category);
      setPhoto(photo);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getSingleProduct(id);
  }, [id]); // Include 'id' in the dependency array

 
  const dispatch = useDispatch()

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append('productName', productName);
      formData.append('price', parseFloat(price));
      formData.append('weight', weight);
      formData.append('stock', parseInt(stock));
      formData.append('category', category);
      formData.append('photo', photo);
  
      const response = await axios.put(`http://localhost:4000/Products/Update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Set the content type for FormData
        }
      });
  
      // Dispatch the action only if the request is successful
      if (response.status === 200) {
        dispatch(updateProduct(response.data)); // Dispatch the updated product data if needed
        navigate('/Product');
      } else {
        console.error('Failed to update product:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };
  



  return (

    <div className="container">
      <Sidebar />
      <div className="mainContent">
        <div className="topSection">
          <div className="headerSection flex">
            <div className="title">
              <h1>Welcome to ....</h1>
              <p>Hello Admin, Welcome back!</p>
            </div>
            <div className="searchBar flex">
              <input type="text" placeholder="Search Dashboard" />
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
          <h2>Update Product details</h2>
        </div>

        <form className="formSection" onSubmit={handleUpdate}>
          <div className="row">
            <div className="col-25">
              <label htmlFor="productName" >Product  </label>
            </div>
            <div className="col-75">
              <input
                type="text"
                placeholder="Product name.."
                
                value={productName}
                onChange={(e) => setProductName(e.target.value) }
              />

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
                onChange={(e) => { setPrice(e.target.value) }}


              />
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
                onChange={(e) => { setWeight(e.target.value) }}

              />
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
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <label htmlFor="photo">Image</label>
            </div>
            <div className="col-75">
              <input type="file" accept="image/*" 
               onChange={(e) => setPhoto(e.target.files[0])}/>
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <label htmlFor="photo">Image</label>
            </div>
            {photo && photo instanceof File ? (
              <div className="col-75">
              <img src={URL.createObjectURL(photo)} alt="Uploaded" style={{ width: '170px', height: '190px', display: 'flex', borderRadius: '10px' }} />
          </div>
      ) : (
            <div> 
              <img  src={`http://localhost:4000/Products/productPhoto/${id}`}
                      style={{ width: '170px', height: '190px',  paddingTop : '10px', display: 'flex', borderRadius: '10px' }}/>
            </div>
)}

          </div>
          <div className="buttons flex">
            <button className="btn" type="submit"  > Update </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default Update;