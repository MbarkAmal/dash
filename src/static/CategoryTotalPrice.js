import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

const CategoryTotalPrice = () => {
    const [chartData, setChartData] = useState(null);
    const [error, setError] = useState(null);
    const chartRef = useRef(null); // Ref for the chart instance

    const fetchData = async (type) => {
        try {
            const response = await axios.get(`http://localhost:4000/static/totalpriceinCategory?type=${type}`);
            console.log(response.data); // Log response data structure for debugging
    
            const data = response.data.totalPricesByCategory;
    
            // Check if data is an array
            if (!Array.isArray(data)) {
                throw new Error('Data is not an array');
            }
    
            const labels = [];
            const totals = [];
    
            data.forEach(item => {
                labels.push(item._id.category);
                totals.push(item.totalPrice);
            });
    
            const ctx = chartRef.current.getContext('2d'); // Get canvas context
            if (chartRef.current.chart) {
                // If chart instance exists, update its data
                chartRef.current.chart.data.labels = labels;
                chartRef.current.chart.data.datasets[0].data = totals;
                chartRef.current.chart.update();
            } else {
                const newChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Total Price',
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                            data: totals
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
                                text: 'Total Price of category  for each month '
                            }
                        }
                    }
                });
                chartRef.current.chart = newChart;
            }
    
            setChartData(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error fetching data. Please try again.');
        }
    };
    
    

    useEffect(() => {
        fetchData('Week'); // Default to Month when component mounts
    }, []);

    return (
        <div style={{ width: '500px', height: '350px', paddingTop: "40px" }}>
            <div style={{ marginLeft: '120px' }}>
                <button style={buttonStyle} onClick={() => fetchData('Week')}>Week</button>
                <button style={buttonStyle} onClick={() => fetchData('Month')}>Month</button>
                <button style={buttonStyle} onClick={() => fetchData('Year')}>Year</button>
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

export default CategoryTotalPrice;
