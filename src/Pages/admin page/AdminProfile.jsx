import React, { useState } from "react";
import "./adminprofile.scss";
import Sidebar from "../../Components/SideBar Section/Sidebar";
import img from "../../../src/Assets/img.jpg";

const AdminProfile = () => {
  const [photo, setPhoto] = useState(null);
  const [saveimg, setSaveimg] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setSaveimg(true);
    }
  };

  const handleSave = () => {
    console.log("Photo saved:", photo);
    setSaveimg(false);
  };

  return (
    <div className="container">
      <Sidebar />

      <div className="mainContent">
        <div className="bottom flex">
          <div className="imgcontainer">
            {photo ? (
              <img src={URL.createObjectURL(photo)} className="orderimg" alt="Uploaded" />
            ) : (
              <img src={img} className="orderimg" alt="Default" />
            )}
          </div>
          <div className="admin_detail">
            <h2>admin name </h2>
            <p>admin@gamil.com - Administrator</p>
            <div className="edit_photo">
              <label htmlFor="file-upload" className="file-upload">
                photo Upload
              </label>
              <input id="file-upload" type="file" onChange={handleFileChange} />
              {saveimg && <button onClick={handleSave}>Save</button>}
            </div>
          </div>
          
        </div>
        <div>
          <div className="detail_accunt">
            <h2>Account Details</h2>
         
            <form className="formSection">
            <div className="row">
            <div className="col-25">
              <label htmlFor="productName">Username</label>
            </div>
            <div className="col-75">
              <input
                type="text" />
            </div>
           </div>

           <div className="row">
            <div className="col-25">
              <label htmlFor="productName">Email</label>
            </div>
            <div className="col-75">
              <input
                type="text" />
            </div>
           </div>

           <div className="row">
            <div className="col-25">
              <label htmlFor="productName">Password </label>
            </div>
            <div className="col-75">
              <input
                type="text" />
            </div>
           </div>

           <div className="row">
            <div className="col-25">
              <label htmlFor="productName">Full Name</label>
            </div>
            <div className="col-75">
              <input
                type="text" />
            </div>
           </div>

           <div className="row">
            <div className="col-25">
              <label htmlFor="">Role</label>
            </div>
            <div className="col-75">
             <select name="role">
             <option value="role">Role</option>
              <option value="user">User</option>
              <option value="admin" >Admin</option>
             </select>
            </div>
           </div>

           <div className="row">
            <div className="col-25">
              <label htmlFor="">Phone Number</label>
            </div>
            <div className="col-75">
              <input
                type="tel" />
            </div>
           </div>
           

           <div className="update_btn">
            <button className="btnUP" type="submit">
              Update Profile
            </button>
          </div>

            </form>
          </div>
          </div>
      </div>
    </div>
  );
};
export default AdminProfile;
