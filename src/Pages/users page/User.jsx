import React, { useState, useEffect } from 'react';
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

//
import axios from 'axios'
import { useDispatch , useSelector} from 'react-redux';
import { getUser } from '../../redux/userSlice';
import { deleteUser } from '../../redux/userSlice';
const User = () => {
  //const [users, setUsers] = useState([]); // State to hold products
  const dispatch = useDispatch() 
  const users = useSelector(state => state.users.users)
 // console.log(useSelector(state => state.users.users));
  useEffect(() => {

    const fetechData = async() => {
      try{
        const response = await axios.get(`http://localhost:4000/User/getAllUser`);
        dispatch(getUser(response.data));
      } catch(error){
        console.log(error)
      }
    }
    fetechData();

    /*getUsers();
  }, []);
    // Fetch products from backend when component mounts
    const getUsers = async () => {
        try {
          const response = await fetch(`http://localhost:4000/User/getAllUser`, {
            method: "GET"
          });
          const data = await response.json(); // Parse response JSON data
          setUsers(data); // Set users state with parsed data
        } catch (error) {
          console.error('Error fetching users:', error);
        }*/
      }, []);
      
  // delete function
 /* const deleteProduct = async (id) => {
    try {
      // Make DELETE request to backend to delete the product
      const response = await fetch(`http://localhost:4000/Products/${id}`, {
        method: "DELETE"
      });
  
      // Check if the request was successful (status code 200-299)
      if (response.ok) {
        const result = await response.json();
        console.log("Deleted:", result);
        getProducts();
      } else {
        // Handle non-successful response
        console.error("Failed to delete product:", response.status, response.statusText);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error deleting product:", error);
    }
  };
   // search products
  /* const searchHandle = async (event) =>{
    let key = event.target.value;
    if(key){
    let result = await fetch (`http://localhost:4000/Products/search/${key}`);
    result = await result.json();
    if(result){
      setProducts(result)
    }
    }else{
      getProducts()
    }
  }*/
  const handleDelete = (id) => {
    axios.delete('http://localhost:4000/User/'+id)
      .then(res => {
        dispatch(deleteUser({id}));
        console.log(res);
      })
      .catch(error => {
        console.error("Error deleting user:", error);
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
              <input type="text" placeholder="Search Dashboard" 
               />
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
              <h2>All Users  </h2>
              
            </div>

            <div className="tableSection flex">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Photo </th>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Password</th>
                   <th>Created AT</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={index}>
                  <td style={{ color: 'var(--PrimaryColor)' }}>#{index+1}</td>
                  <td>
                    <img src={`http://localhost:4000/User/userPhoto/${user.id}`} alt={user.name}
                     style={{ width: '40px' , height: '40px' , objectFit : 'cover' , borderRadius: '40%' , boxShadow :' 0 2px 4px ' , marginLeft : '1rem' }} />
                  </td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td style={{ wordBreak :'break-word' }}>{user.password}</td>
                <td>{user.createdAt}</td>
                  <td>
              <div className="buttons flex">
          <Link to={`/UpdateUser/${user.id}`} className="btn"><FaPencil className ='icon'/></Link>
          <button className="btn" onClick={() => handleDelete(user.id)}><MdDelete className='icon'/></button>
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

export default User;
