import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

// Define the TotalPriceChart component
const TotalPriceChart = () => {
    const chartRef = useRef(null);
    const [totalPriceData, setTotalPriceData] = useState(null);
    const [error, setError] = useState(null);
    const [chartInstance, setChartInstance] = useState(null);

    useEffect(() => {
        // Function to fetch total price data from backend API
        const fetchTotalPriceData = async () => {
            try {
                const response = await fetch('http://localhost:4000/Orders/counttotalprice');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return await response.json();
            } catch (error) {
                console.error('Error fetching total price data:', error);
                throw error;
            }
        };

        // Fetch total price data and update state
        fetchTotalPriceData()
            .then(data => {
                setTotalPriceData(data);
            })
            .catch(error => {
                console.error('Error fetching total price data:', error);
                setError(error.message);
            });
    }, []);

    useEffect(() => {
        // Create or update the chart when totalPriceData changes
        if (totalPriceData) {
            // Destroy existing chart instance if it exists
            if (chartInstance) {
                chartInstance.destroy();
            }

            // Get context of the canvas element
            const ctx = chartRef.current.getContext('2d');

            // Create new chart instance
            const newChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: totalPriceData.map(entry => `${entry._id.month}/${entry._id.year}`),
                    datasets: [{
                        label: 'Total Price of Orders',
                        data: totalPriceData.map(entry => entry.total),
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
                            text: 'Total Price of Orders delivered  for each month '
                        }
                    }
                }
            });

            // Set the chart instance in state
            setChartInstance(newChartInstance);
        }
    }, [totalPriceData]);

    return (
        <div >
            <div className="chart"  style={{ width: '500px', height: '300px' , paddingTop: "40px"}}>
                {error ? (
                    <div>Error: {error}</div>
                ) : (
                    <canvas ref={chartRef}></canvas>
                )}
            </div>
        </div>
    );
};

// Export the TotalPriceChart component
export default TotalPriceChart;