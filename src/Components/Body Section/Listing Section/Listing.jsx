import React, { useState , useEffect } from 'react'
import axios from 'axios'

import './listing.css'
import './Listing.scss'

// import icon
import {BsArrowRightShort} from 'react-icons/bs'
import {AiFillHeart} from 'react-icons/ai'
import { MdProductionQuantityLimits } from "react-icons/md";
import { FaUserCheck } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";

//import image
import img from'../../../Assets/img.jpg'
import img2 from '../../../Assets/img.jpg'

import ProductService from '../../../serices/ProductServices';
import { Link } from 'react-router-dom'
import { getUser } from '../../../redux/userSlice'
import { GiMetalScales } from 'react-icons/gi'



const Listing = () => {

  const [products , setProducts] = useState([]);
  const [users , setUsers] = useState([]);
  const [orders , setOrders] =useState ([]);
  const [sales , setSales] = useState(0);

  useEffect(() => {
   getProducts();
   getUsers();
    getSales();
    getOrders();
  }, []);

    const getProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/static/countproductsdeliveredfortoday`) ; 
        console.log('Response:', response.data); 
        if (response.data.length >0){
          setProducts(response.data[0].totalProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const getUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/static/countconsumercreatedfortoday`) ; 
        console.log('Response:', response.data); 
        if(response.data.length >0){
        setUsers(response.data[0].count); 
        }
      }catch(err){
        console.error('error fetching number of nex conumer for today' , err)
      }
    };



    const getSales = async () => {
      try {
        const response = await axios.get('http://localhost:4000/static/counttotalpricefortoday');
        console.log('Response:', response.data); // Log the response data for debugging
        if (response.data.length > 0) {
          setSales(response.data[0].total);
        }    
        }catch(error) {
        console.error('error fetching totale sales for today ')
      }
    };

    const getOrders = async() => {
      try {
        const response = await axios.get('http://localhost:4000/static/countorderdeliveredfortoday');
        console.log('response' , response.data);
        setOrders(response.data.count);
      }catch(err) {
        console.error('error fetching number of orders for today')
      }
    }

  return (
    <div className='listingSection'>

      <div className="heading flex">
        <h1> Today Stat</h1>
        <button className='btn flex'>
          See All <BsArrowRightShort className='icon'/>
        </button>
      </div>

      <div className="secContainer flex">

          <div className="singleItem">
      <AiFillHeart className='icon'/>
      <h3> Sales for Today: {sales} $</h3>
    </div>


        <div className="singleItem">
          <MdDeliveryDining className='icon'/>
          <h3> Orders for Today: {orders} </h3>
        </div>

        <div className="singleItem">
          <MdProductionQuantityLimits  className='icon'/>
          <Link to={'/Product'}>
        <h3> Products sales for Today : {products} </h3>
         </Link>
        </div>

       
        <div className="singleItem">
          <FaUserCheck  className='icon'/>
          <h3> New Consumer : {users}  </h3>
        </div>


        

      </div>

      <div className="sellers flex">
        <div className="topSellers">
          <div className="heading flex">
            <h3>Top Sellers</h3>
            <button className='btn felx' >
                Sell All <BsArrowRightShort className='icon'/>
             </button>
          </div>

          <div className="card flex">
            <div className="users">
              <img src={img2} alt='User Image'/>
              <img src={img2} alt='User Image'/>
              <img src={img2} alt='User Image'/>
              <img src={img2} alt='User Image'/>
            </div>
            <div className="cardText">
              <span>
                2500 Product sold<br/>
                <small>
                  20 sellers <span className='date'>7 Days</span>
                </small>
              </span>
            </div>
          </div>
        </div>

        <div className="featuredSellers">
          <div className="heading flex">
            <h3>Featured Sellers</h3>
            <button className='btn felx' >
                Sell All <BsArrowRightShort className='icon'/>
             </button>
          </div>

          <div className="card flex">
            <div className="users">
              <img src={img2} alt='User Image'/>
              <img src={img2} alt='User Image'/>
              <img src={img2} alt='User Image'/>
              <img src={img2} alt='User Image'/>
            </div>
            <div className="cardText">
              <span>
                2500 Product sold<br/>
                <small>
                  20 sellers <span className='date'>7 Days</span>
                </small>
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Listing