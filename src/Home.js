import React from "react";
import './app.css'
import Sidebar from "./Components/SideBar Section/Sidebar";
import Body from "./Components/Body Section/Body";

function Home () {
    return (
            <div className="container">
                <Sidebar/>
                <Body/>
            </div>
        
    )
}
export default Home;
