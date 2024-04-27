import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './top.css'
import './Top.scss'
//impoet icons
import {BiSearchAlt } from 'react-icons/bi'
import {TbMessageCircle} from 'react-icons/tb'
import {IoNotificationsOutline } from 'react-icons/io5'
import {BsArrowRightShort } from 'react-icons/bs'

//import images
import img from'../../../Assets/img.jpg'
import video from '../../../Assets/video.mp4'
import img2 from'../../../Assets/img.jpg'



const Top = () => {
  const [ordersCount, setOrdersCount] = useState('');

 /* useEffect(() => {
    fetch('http://localhost:4000/Orders/countorder')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setOrdersCount(data.count);
      })
      .catch(error => {
        console.error('Error fetching order count:', error);
        // Handle error state here if needed
      });
  }, []); // Empty dependency array ensures useEffect runs only once, similar to componentDidMount
  */
  return (
    <div className='topSection'>
      <div className="headerSection flex">
        <div className="title">
          <h1>Welcome to ....</h1>
          <p>Hello Admin, Welcome back!</p>
        </div>

        <div className="searchBar flex">
          <input type='text' placeholder='Search Dashbord'/>
          <BiSearchAlt  className="icon"/>
        </div>

        <div className="adminDiv flex ">
          <TbMessageCircle className='icon'/>
          <IoNotificationsOutline  className='icon'/>
          <div className='adminImage'>
            <Link to={'/AdminProfile'}>
            <img src={img} alt='Admin Image'/>
            </Link>
          </div>
    
        </div>
      </div>

     <div className="cardSection flex">

        <div className="rightCard flex">
          <h1>Create and sell perfect products</h1>
          <p> The world's fast growing industry today are nature made products!</p>

          <div className="buttons flex">
               <div className="btn">Explore More</div>
               <div className="btn transparent">Top Sellers</div>
          </div>
          <div className="videoDiv">
               <video src={video} autoPlay loop muted/>
          </div>
        </div>

       <div className="leftCard flex">
        <div className="main flex">

          <div className="textDiv">
            <h1>My Stat</h1>

            <div className="flex">
                      <span>
            Today <br/> 
            {ordersCount !== '' ? (
              <small>{ordersCount} {ordersCount === 1 ? 'Order' : 'Orders'}</small>
            ) : (
              <small>Loading...</small>
            )}
          </span>
            </div>
              <span className="flex link">
            <Link to={'/OrderChart'} style={{ color: 'var(--PrimaryColor)' }} >Go to my delivery stat <BsArrowRightShort className="icon" /></Link>
          </span>
          </div>

          <div className="imgDiv">
            <img src={img2} alt='Image Name'/>
          </div>
          
              {/*we used later */}
       { /*   <div className="sideBarCard">
              <BsQuestionCircle className='icon' />
              <div className="cardContent">
              <div className="circle1"></div>
              <div className="circle2"></div>
              <h3>Help Center</h3>
              <p>Having trouble , please Contact us for more Questions</p>
              <button className='btn'> Go to help Center</button>
            </div>
              </div>*/}

        </div>
      </div>

            </div>
    </div>
  )
}

export default Top