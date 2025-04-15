// src/components/portfolio/PortfolioList.jsx
import React from 'react';

const PortfolioList = ({ portfolio }) => {
  // Check if portfolio data exists and is valid
  if (!Array.isArray(portfolio) || portfolio.length === 0) {
    return <div>No assets in your portfolio.</div>;
  }

  return (
    <div>
      <h3>Portfolio Assets</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {portfolio.map((asset, index) => (
          <li
            key={index}
            style={{
              marginBottom: '10px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
            }}
          >
            <strong>{asset.symbol || asset.name}</strong> - Quantity: {asset.quantity}, Purchase Price: $
            {asset.purchase_price || asset.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PortfolioList;