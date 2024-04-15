import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

const TotalPrice = () => {
    const [totalPrices, setTotalPrices] = useState(null);
    const [error, setError] = useState(null);
    const chartRef = useRef(null); // Ref for the chart instance

    const fetchTotalPrice = async (type) => {
        try {
          const response = await axios.get(`http://localhost:4000/static/totalPriceForWeekMonthYear?type=${type}`);
          console.log(response.data); // Log response data structure for debugging
          const data = response.data.totalPrice; // Assuming the total prices are under totalPrice key in the response
          const labels = [];
          const totals = [];
      
          // Extract labels and total prices from the response data
          data.forEach(item => {
            labels.push(item._id[type.toLowerCase()]);
            totals.push(item.total);
          });

          const ctx = chartRef.current.getContext('2d'); // Get canvas context
          if (chartRef.current.chart) {
            // If chart instance exists, update its data
            chartRef.current.chart.data.labels = labels;
            chartRef.current.chart.data.datasets[0].data = totals;
            chartRef.current.chart.update();
          } else {
            // Create new chart instance
            const newChart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: labels,
                datasets: [{
                  label: 'Total Price of Sellers ',
                  data: totals,
                  borderColor:'rgba(255, 99, 132, 1)',
                  backgroundColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 1,
                  tension: 0.1,
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
                        text: 'Total Price of Orders delivered  for each month '
                    }
                }
            }

            });
            chartRef.current.chart = newChart;
          }

          setTotalPrices(data);
          setError(null); // Reset error state
        } catch (error) {
          console.error('Error fetching total price:', error);
          setError('Error fetching total price. Please try again.'); // Set error state
        }
      };

    useEffect(() => {
        fetchTotalPrice('Week'); // Fetch data for the week when component mounts
    }, []); // Empty dependency array to ensure effect runs only once
  
    return (
      <div style={{ width: '500px', height: '350px' , paddingTop: "40px"}}>
        
        <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button style={buttonStyle} onClick={() => fetchTotalPrice('Week')}>Week</button>
                <button style={buttonStyle} onClick={() => fetchTotalPrice('Month')}>Month</button>
                <button style={buttonStyle} onClick={() => fetchTotalPrice('Year')}>Year</button>
            </div>

        
            <div className="chart"  >
                {error ? (
                    <div>Error: {error}</div>
                ) : (
                    <canvas ref={chartRef}></canvas>
                )}
            </div>
        
      </div>
    );
  };
  const buttonStyle = {
    border: '1px solid transparent',
    backgroundColor: 'rgba(51, 51, 51, 0.05)',
    color: '#333333',
    borderRadius: '8px',
    fontWeight: '500',
    fontSize: '14px',
    width: '70px',
    height: '40px',
    cursor: 'pointer',
    marginRight: '10px'
};
export default TotalPrice;
