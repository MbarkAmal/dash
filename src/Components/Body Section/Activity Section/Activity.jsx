import React, { useEffect, useState } from 'react';
import './activity.css';
import './Activity.scss';

// Import icons
import { BsArrowRightShort } from 'react-icons/bs';
// Import image
import user from '../../../Assets/img.jpg';
import axios from 'axios';

const Activity = () => {
  const [lastOrders, setLastOrders] = useState([]);

  useEffect(() => {
    const fetchLastOrder = async () => {
      try {
        const response = await axios.get('http://localhost:4000/Orders/getlastcustomerorder');
        setLastOrders(response.data);
      } catch (err) {
        console.error("Error fetching last orders", err);
      }
    };

    fetchLastOrder();
  }, []);

  return (
    <div className='activitySection'>
      <div className="heading flex">
        <h1>Recent Activity</h1>
        <button className='btn flex'>
          See All 
          <BsArrowRightShort className='icon'/>
        </button>
      </div>
      <div className="secContainer grid">
        {lastOrders.map((order, index) => (
          <div className="singleCustomer flex" key={index}>
            <img src={`http://localhost:4000/Orders/getphoto/${order.customer._id}`} alt="Customer Image" />
            <div className="customerDetails">
              <span className="name">{order.customer.username}</span>
              <small>Ordered a new Product</small>
            </div>
            <div className="duration">2 min ago</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Activity;
