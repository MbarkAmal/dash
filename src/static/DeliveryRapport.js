import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const DeliveryRapport = () => {
    const chartRef = useRef(null);
    const [orderCounts, setOrderCounts] = useState(null);
    const [error, setError] = useState(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        // Fetch order counts by status from the backend API
        const fetchOrderCountsByStatus = async () => {
            try {
                const response = await fetch('http://localhost:4000/static/countorderbyStatus');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return await response.json();
            } catch (error) {
                console.error('Error fetching order counts by status:', error);
                throw error;
            }
        };

        // Call the fetch function and update state
        fetchOrderCountsByStatus()
            .then(data => {
                setOrderCounts(data);
            })
            .catch(error => {
                console.error('Error fetching order counts by status:', error);
                setError(error.message);
            });
    }, []);

    useEffect(() => {
        // Create or update the chart when orderCounts changes
        if (orderCounts && chartRef.current) {
            // Destroy existing chart instance if it exists
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            // Get context of the canvas element
            const ctx = chartRef.current.getContext('2d');

            // Create new chart instance
            chartInstance.current = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: orderCounts.map(entry => entry._id),
                    datasets: [{
                        label: 'Orders by Status',
                        data: orderCounts.map(entry => entry.count),
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
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Orders by Status'
                        }
                    }
                }
            });
        }
    }, [orderCounts]);

    return (
        <div>
            <div className="chart" style={{ width: '300px', height: '300px', paddingTop: "40px" }}>
                {error ? (
                    <div>Error: {error}</div>
                ) : (
                    <canvas ref={chartRef}></canvas>
                )}
            </div>
        </div>
    );
};

export default DeliveryRapport;
