// Import necessary libraries
import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import Sidebar from '../Components/SideBar Section/Sidebar';
import { BiSearchAlt } from 'react-icons/bi';
import { TbMessageCircle } from 'react-icons/tb';
import { IoNotificationsOutline } from 'react-icons/io5';
import img from '../../src/Assets/img.jpg';

import TotalPrice from './TotalPrice';
import DeliveryRapport from './DeliveryRapport';

const OrderChart = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const [orderData, setOrderData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const response = await fetch('http://localhost:4000/static/countformonth');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return await response.json();
            } catch (error) {
                console.error('Error fetching order data:', error);
                throw error;
            }
        };

        fetchOrderData()
            .then(data => {
                setOrderData(data);
            })
            .catch(error => {
                console.error('Error fetching order data:', error);
                setError(error.message);
            });
    }, []);

    useEffect(() => {
        if (orderData) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');

            chartInstance.current = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: orderData.map(entry => `${entry._id.month}/${entry._id.year}`),
                    datasets: [{
                        label: 'Number of Orders',
                        data: orderData.map(entry => entry.count),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 205, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 205, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: ' Number of Orders Delivered '
                        }
                    }
                }
              
            });
        }
    }, [orderData]);

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
                <h2> Delivery Rapport  </h2>

                </div>
                </div>
                </div>

                <div className="secContainer flex" >
                  <div className='chart1'>
                    <DeliveryRapport/>                        
                    </div>

                    <div className='chart2'>
                <TotalPrice />
                </div>
                
                </div>

                <div className='chart flex'>
                <div className='chart3' style={{ width: '300px', height: '300px' , paddingTop: "0px"}}>
                    {error ? (
                        <div>Error: {error}</div>
                    ) : (
                        <canvas ref={chartRef} width="100" height="100"></canvas>
                    )}
                </div>
                
                </div>
            </div>
        </div>
    );
};

// Export the OrderChart component
export default OrderChart;
