import React from 'react'
import  './sidebar.css'
import './Sidebar.scss'
import { Link } from 'react-router-dom'


import logo from '../../Assets/logo.jpg'


import { IoMdSpeedometer } from "react-icons/io";
import { MdDeliveryDining } from "react-icons/md";
import { MdOutlineExplore } from "react-icons/md";
import { BsQuestionCircle } from "react-icons/bs";
import { FaUserCheck } from "react-icons/fa";
import { MdProductionQuantityLimits } from "react-icons/md";



const Sidebar = () => {
  return (
    <div className='sideBar grid'>
      <div className='logoDiv flex'>
        <img src={logo} alt='Image Name'/>
        <h2>Dash</h2>
      </div>

      <div className='menuDiv'>
        <h3 className='divTitle'>
          QUICK MENU
        </h3>
        <ul className='menuLists grid'>

          <li className='listItem'>
          <Link to={'/'} className='menuLink felx'>
              <IoMdSpeedometer className='icon' />
              <span className='smallText'>
                  Dashbord
                </span>
            </Link>
          </li>

          <li className='listItem'>
            <Link to={'/Product'} className='menuLink felx'>
              <MdProductionQuantityLimits   className='icon' />
              <span className='smallText'>
                  Products
                </span>
            </Link>
          </li>

          <li className='listItem'>
          <Link to={'/User'} className='menuLink felx'>
              <FaUserCheck  className='icon' />
              <span className='smallText'>
                Users
              </span>
            </Link>
          </li>

          <li className='listItem'>
            <Link to={'/Order'} className='menuLink felx'>
              <MdDeliveryDining  className='icon' />
              <span className='smallText'>
                  Orders
                </span>
            </Link>
          </li>

         

        </ul>
      </div>



      <div className='settingsDiv'>
        <h3 className='divTitle'>
          MY STAT 
        </h3>
        <ul className='menuLists grid'>

          <li className='listItem'>
          <Link to={'/OrderChart'} className='menuLink felx'>
              <IoMdSpeedometer className='icon' />
              <span className='smallText'>
              Sales STAT
                </span>
            </Link>
          </li>

          <li className='listItem'>
          <Link to={'/ProductsChart'} className='menuLink felx'>
              <MdDeliveryDining  className='icon' />
              <span className='smallText'>
              Products STAT
              </span>
            </Link>
          </li>

          <li className='listItem'>
            <a href='#' className='menuLink felx'>
              <MdOutlineExplore  className='icon' />
              <span className='smallText'>
                  Contact 
                </span>
            </a>
          </li>

          <li className='listItem'>
            <a href='#' className='menuLink felx'>
              <MdOutlineExplore  className='icon' />
              <span className='smallText'>
                  builing
                </span>
            </a>
          </li>

        </ul>
      </div>

      <div className="sideBarCard">
        <BsQuestionCircle className='icon' />
        <div className="cardContent">
        <div className="circle1"></div>
        <div className="circle2"></div>

        <h3>Help Center</h3>
        <p>Having trouble , please Contact us for more Questions</p>
        <button className='btn'> Go to help Center</button>
      </div>

      </div>
    </div>
  )
}

export default Sidebar