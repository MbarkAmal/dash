import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const DeliveredProducts = () => {
  const chartRef = useRef(null);
  const [productsCounts, setProductsCounts] = useState(null);
  const [error, setError] = useState(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const fetchProductCountsByCategory = async () => {
      try {
        const response = await fetch('http://localhost:4000/static/countproductssellersbyCategory');
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
          labels: productsCounts.map(entry => entry.category.category), // Assuming category is an object with a 'category' property
          datasets: [{
            label : 'products sales in month',
            data: productsCounts.map(entry => entry.productssellers),
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
              text: 'Products sales by Category'
            }
          }
        }
      });
    }
  }, [productsCounts]);

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

export default DeliveredProducts;
