import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import DeliveredProducts from './DeliveredProducts';
import CategoryTotalPrice from './CategoryTotalPrice';
import img from '../../src/Assets/img.jpg';
import Sidebar from '../Components/SideBar Section/Sidebar';
import { BiSearchAlt } from 'react-icons/bi';
import { TbMessageCircle } from 'react-icons/tb';
import { IoNotificationsOutline } from 'react-icons/io5';

const ProductsChart = () => {
  const chartRef = useRef(null);
  const [productsCounts, setProductsCounts] = useState(null);
  const [error, setError] = useState(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const fetchProductCountsByCategory = async () => {
      try {
        const response = await fetch('http://localhost:4000/Products/countallProductsByCategory');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching product counts by category:', error);
        throw error;
      }
    };

    fetchProductCountsByCategory()
      .then(data => {
        setProductsCounts(data);
      })
      .catch(error => {
        console.error('Error fetching product counts by category:', error);
        setError(error.message);
      });
  }, []);

  useEffect(() => {
    if (productsCounts && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');

      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: productsCounts.map(entry => entry.category.category),
          datasets: [{
            label : 'products numbers ',
            data: productsCounts.map(entry => entry.numberofproducts),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              // Add more colors if needed
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 205, 86, 1)',
              // Add more colors if needed
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'ALL Products by Category'
            }
          }
        }
      });
    }
  }, [productsCounts]);

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
                  <div className="chart" style={{ width: '300px', height: '300px', paddingTop: "40px" }}>
                    {error ? (
                      <div>Error: {error}</div>
                    ) : (
                      <canvas ref={chartRef}/> 
                      
                      
                    )}

                  </div>
                  <div className='chart2'>
                  <CategoryTotalPrice/>
                  </div>

                </div>
                <div>
                  <DeliveredProducts/>
                </div>
                </div>
        </div>
  );
};

export default ProductsChart;
