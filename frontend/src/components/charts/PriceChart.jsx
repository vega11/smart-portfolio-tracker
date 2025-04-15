// src/components/charts/PriceChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';

const PriceChart = ({ priceData }) => {
  // Check if priceData exists and is valid
  if (!Array.isArray(priceData) || priceData.length === 0) {
    return <div>No price data available.</div>;
  }

  // Format data for the chart
  const chartData = {
    labels: priceData.map((dataPoint) => dataPoint.date),
    datasets: [
      {
        label: 'Price Trend',
        data: priceData.map((dataPoint) => dataPoint.price),
        fill: false,
        borderColor: '#36A2EB',
        tension: 0.1,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default PriceChart;