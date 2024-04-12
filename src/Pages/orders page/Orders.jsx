import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { deleteOrder, getOrder } from "../../redux/orderSlice";
import Sidebar from '../../Components/SideBar Section/Sidebar';
import { BiSearchAlt } from 'react-icons/bi';
import { TbMessageCircle } from 'react-icons/tb';
import { IoNotificationsOutline } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';
import img from '../../../src/Assets/img.jpg';

const Orders = () => {
  const dispatch = useDispatch();
  const orders = useSelector(state => state.orders.orders);
  const [statusFilter, setStatusFilter] = useState('');

  // Define fetchData function outside of useEffect
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/Orders/getallOrders`);
      dispatch(getOrder(response.data));
    } catch (error) {
      console.log(error);
      // Handle error
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = (event) => {
    const status = event.target.value;
    setStatusFilter(status);
  };

  const filteredOrders = statusFilter ? orders.filter(order => order.status === statusFilter) : orders;

  const handleDelete = (id) => {
    axios.delete(`http://localhost:4000/Orders/deleteOrder/${id}`)
      .then(res => {
        dispatch(deleteOrder({ id }));
        console.log(res);
        fetchData(); // Call fetchData to refresh orders after deletion
      })
      .catch(error => {
        console.error("Error deleting order", error);
      });
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
        <div className="bottom flex">
          <div className="ProductSection">
            <div className="heading flex">
              <h2>All Orders</h2>
              <div>
                <select name="status" value={statusFilter} onChange={handleStatusChange}>
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">cancelled</option>

                </select>
              </div>

            </div>
            <div className="tableSection flex">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Total</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Created at</th>
                    <th> </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr key={index}>
                      <td style={{ color: 'var(--PrimaryColor)' }}>#{index + 1}</td>
                      <td>{order.totalPrice}</td>
                      <td>{order.customer.username}</td>
                      <td style={{ color: getStatusColor(order.status) }}>
                        {order.status}</td>
                      <td>{order.createdAt}</td>
                      <td >
                        <button
                          className="btn"
                          onClick={() => handleDelete(order._id)}
                          style={{ backgroundColor: 'transparent' }}
                        >
                          <MdDelete className='icon' />
                        </button>
                      </td>
                    </tr>

                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// Function to determine button color based on status
const getStatusColor = (status) => {
  switch (status) {
    case 'delivered':
      return 'green'; // Green color for "Delivery" status
    case 'pending':
      return 'orange'; // Yellow color for "Pending" status
    case 'cancelled':
      return 'red'; // Red color for "Cancelled" status
    default:
      return 'transparent'; // Default transparent color for other statuses
  }
};
export default Orders;
