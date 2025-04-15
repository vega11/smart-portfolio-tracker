// src/components/charts/PortfolioPieChart.jsx
import React from 'react';
import { Pie } from 'react-chartjs-2';

const PortfolioPieChart = ({ portfolio }) => {
  // Check if portfolio data exists and is valid
  if (!Array.isArray(portfolio) || portfolio.length === 0) {
    return <div>No portfolio data available.</div>;
  }

  // Format data for the pie chart
  const chartData = {
    labels: portfolio.map((asset) => asset.symbol || asset.name), // Use symbol or name
    datasets: [
      {
        label: 'Portfolio Distribution',
        data: portfolio.map((asset) => asset.quantity),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  return <Pie data={chartData} />;
};

export default PortfolioPieChart;