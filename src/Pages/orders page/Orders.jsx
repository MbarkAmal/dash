import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { deleteOrder, getOrder } from "../../redux/orderSlice";
import Sidebar from '../../Components/SideBar Section/Sidebar';
import { BiSearchAlt } from 'react-icons/bi';
import { TbMessageCircle } from 'react-icons/tb';
import { IoNotificationsOutline } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';
import { TbListDetails } from "react-icons/tb";
import img from '../../../src/Assets/img.jpg';

const Orders = () => {
  const dispatch = useDispatch();
  const orders = useSelector(state => state.orders.orders);
  const [statusFilter, setStatusFilter] = useState('');
   const [selectedOrderId, setSelectedOrderId] = useState(null); // State to store selected order ID
  const [orderDetail, setOrderDetail] = useState(null);
  const modalRef = useRef(null);
  const [status , setStatus] = useState('');
  

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch orders data from the server
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/Orders/getallOrders`);
      dispatch(getOrder(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChange = (event) => {
    const status = event.target.value;
    setStatusFilter(status);
  };

  const filteredOrders = statusFilter ? orders.filter(order => order.status === statusFilter) : orders;

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this order?");
    if (!confirmed) return; 
    
    axios.delete(`http://localhost:4000/Orders/deleteOrder/${id}`)
      .then(res => {
        dispatch(deleteOrder({ id }));
        console.log(res);
        fetchData(); 
      })
      .catch(error => {
        console.error("Error deleting order", error);
      });
  };

  const openModal = (orderId) => {
    setSelectedOrderId(orderId); 
    modalRef.current.style.display = 'block';
    fetchOrderDetail(orderId); 
  };

  const closeModal = () => {
    modalRef.current.style.display = 'none';
  };

  const fetchOrderDetail = (orderId) => {
    axios.get(`http://localhost:4000/Orders/getOrderDetailByID/${orderId}`)
    
      .then(res => {
        setOrderDetail(res.data.result); 
        fetchData(); 
      })
      .catch(error => {
        console.error("Error fetching order detail", error);
      });
  };
  

  //update status order
  const updateStatus = (id) => {
    try {
      const data = { status }; 
      console.log('Updating status for order ID:', id);
      console.log('New status:', status);
      
      axios.put(`http://localhost:4000/Orders/updateStatus/${id}`, data, {
        headers: {
          'Content-Type': 'application/json' 
        }
      })
      .then(response => {
        if (response.status === 200) {
          console.log('Status updated successfully!', response);
          fetchData(); 
        } else {
          console.error('Failed to update status:', response.statusText);
        }
      })
    
    } catch (err) {
      console.error('Error updating status:', err);
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
        <div className="bottom flex">
          <div className="ProductSection">
            <div className="heading flex">
              <h2>All Orders</h2>
              <div>
                <select name="status" value={statusFilter} onChange={handleStatusChange}>
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
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
      <td style={{ color: getStatusColor(order.status) }}>{order.status}</td>
      <td>{order.createdAt}</td>
      <td>
        <button
          className="btn"
          onClick={() => handleDelete(order._id)}
          style={{ backgroundColor: 'transparent' }}
        >
          <MdDelete className='icon' />
        </button>
        <button
          className="btn"
          style={{ backgroundColor: 'transparent' }}
          onClick={() => openModal(order._id)}
        > 
          <TbListDetails className='icon'/>
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

      <div id="id01" ref={modalRef} className="modal" style={{ display: 'none' }} >
        {/* Modal content */}
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          { orderDetail && (
          <div className="imgcontainer">
            <img src={`http://localhost:4000/Orders/getphoto/${orderDetail.customer._id}`} className="orderimg"/>

          </div>
           )}

          <div className="divdetail" >
          {orderDetail && (
            <div>
              <h4>Order Detail</h4>
              {orderDetail.products.map((product, index) => (
                <div key={index}>
                  <p>{product.productName} : {product.price} dt</p>
                  <p>Quantity : {product.stock}</p>
                </div>
              ))}
            </div>
          )}

          

          </div>
          { orderDetail && (
            <div className="constumerdetail">
            <h4>Customer detail : </h4>
            <p> {orderDetail.customer.username}</p>
            <p>email :bjqbnfknfn!l</p>
           </div>
           

          )}

      <></>
          { orderDetail && (

        <div className="div3">
          <div className="div-container">
              <p>Total Price</p>
              <p>{orderDetail.totalPrice}</p>
           </div>

            <div className="div-container">
              <p>Order Status</p>
              <p style={{ color: getStatusColor(orderDetail.status) }}>{orderDetail.status}</p>
            </div>
            <div className="div-container">
              <p>Process order</p>
              <select
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Status">Status</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
            <button className="btn_up" type="button" onClick={() => updateStatus(orderDetail._id)}>
              Update Status
            </button>
            </div>
                        )}

            
          </div>
          
        
          
        </div>

      {/* Modal styling */}
      <style>
        {`
         
          .modal {
            display: none; 
            position: fixed; /* Fixed position to overlay content */
            z-index: 999; /* Ensure modal is above other content */
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5); 
            overflow: auto; 
          }
          .modal-content {
            background-color: #E1E8ED; /* White background for modal content */
            margin: 15% auto; /* Center modal vertically and horizontally */
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
            height : 70%;
            max-width: 600px; /* Limit maximum width of modal content */
            border-radius: 20px;
            box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;          
          .imgcontainer {
            
            float: left; 
            width: 30%; 
            margin: 25px 0 12px 0;
          }

       
          
          .divdetail {
            float: left; /* Float the divdetail to the left */
            width: 30%; 
           margin-top : 35px;
           margin-left : 25px ;
          }
          
          .constumerdetail{
            float : right;
            margin-top : 35px;
            margin-right : 15px;
           


          }
          .div3{
            float : left;
            justify-content: start; 
            width : 90%;
            margin-top : 50px;
            margin-left: 20px;

            .btn_up{
              margin-top:15px;
              margin-left:40%;
              margin-top:15px;
              margin-left:40%;
              background-color: hsl(94, 59%,35%);
              border-radius: 8px;
              border-style: none;
              box-sizing: border-box;
              color: #FFFFFF;
              cursor: pointer;
              display: inline-block;
              font-family: "Haas Grot Text R Web", "Helvetica Neue", Helvetica, Arial, sans-serif;
              font-size: 14px;
              font-weight: 500;
              height: 40px;
              width : 100px;
              line-height: 20px;
              list-style: none;
              outline: none;
              text-decoration: none;
              user-select: none;
              touch-action: manipulation;

            }
            
          }
          .div-container{
            display: flex;
          justify-content: space-between; 
          margin-top :15px;
          }
         
          
          
          /* Adjustments for img style */
          .orderimg {
            width: 100%; 
            border-radius: 50%;
          }
          

          /* Close button styling */
          .close {
            color: hsl(94, 59%,35%);
            float: right;
            font-size: 30px;
            font-weight: bold;
          }

          .close:hover,
          .close:focus {
            color: hsl(94, 59%,35%);
            text-decoration: none;
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'delivered':
      return 'green'; 
    case 'pending':
      return 'orange'; 
    case 'cancelled':
      return 'red'; 
    default:
      return 'transparent'; 
  }
};

export default Orders;
