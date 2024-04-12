import React, { useState, useEffect } from 'react';
import './Product.scss';
import { Link } from 'react-router-dom';
// Import icons
import { GoPlusCircle } from 'react-icons/go';
import Sidebar from '../../Components/SideBar Section/Sidebar';
import ProductService from '../../serices/ProductServices';

import { MdDelete } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";


import { BiSearchAlt } from 'react-icons/bi';
import { TbMessageCircle } from 'react-icons/tb';
import { IoNotificationsOutline } from 'react-icons/io5';
import img from '../../../src/Assets/img.jpg';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getProduct , deleteProduct} from '../../redux/productSlice';

// Function to fetch products from backend
const fetchData = async (dispatch) => {
  try {
    const response = await axios.get(`http://localhost:4000/Products/getAllProducts`);
    dispatch(getProduct(response.data));
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

const Product = () => {
  const dispatch = useDispatch();
  const products = useSelector (state => state.products.products);

  useEffect(() => {
    // Fetch products from backend when component mounts
    fetchData(dispatch);
  }, [dispatch]);

  // delete function
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/Products/` + id)
      .then(res => {
        dispatch(deleteProduct({id}));
        console.log(res);
      })  
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error deleting product:", error);
    }
  };

  // search products
  const searchHandle = async (event) => {
    let key = event.target.value;
    try {
      if (key) {
        const response = await axios.get(`http://localhost:4000/Products/search/${key}`);
        const data = response.data;
        dispatch(getProduct(data)); // Assuming getProduct action updates the products state in Redux
      } else {
        // If the search key is empty, fetch all products
        fetchData(dispatch); // Call fetchData function
      }
    } catch (error) {
      console.error('Error searching for products:', error);
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
              <input type="text" placeholder="Search Dashboard" onChange={searchHandle} />
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

        <div className="bottom flex">
          <div className="ProductSection">
            <div className="heading flex">
              <h2>All Products </h2>
              <Link to={'/Product/AddProduct'} className="btn flex">
                Add Product <GoPlusCircle className="icon" />
              </Link>
            </div>

            <div>
              <select name="category">
                <option value="">category</option>
                <option value="pending">Date</option>
                <option value="delivered">dry_fruit</option>
              </select>
            </div>

            <div className="tableSection flex">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product</th>
                    <th>Photo</th>
                    <th>category</th>
                    <th>Price</th>
                    <th>Weight</th>
                    <th>Stock</th>
                    <th>created At</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((product, index) => (
                      <tr key={index}>
                        <td style={{ color: 'var(--PrimaryColor)' }}>#{index + 1}</td>
                        <td>{product.productName}</td>
                        <td>
                          <img src={`http://localhost:4000/Products/productPhoto/${product.id}`} alt={product.name} style={{ width: '60px', height: '50px', objectFit: 'cover', borderRadius: '20%', boxShadow: '0 2px 4px ', marginLeft: '1rem' }} />
                        </td>
                        <td>{product.category}</td>
                        <td>{product.price}</td>
                        <td>{product.weight}</td>
                        <td>{product.stock}</td>
                        <td>{product.createdAt}</td>
                        <td>
                          <div className="buttons flex">
                            <Link to={`/Product/UpdateProduct/${product.id}`} className="btn"><FaPencil className='icon' /></Link>
                            <button className="btn" onClick={() => handleDelete(product.id)}><MdDelete className='icon' /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">
                        <h3>No results found</h3>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
