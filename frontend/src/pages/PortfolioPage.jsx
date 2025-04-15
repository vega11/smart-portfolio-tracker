// src/pages/PortfolioPage.jsx
import React from 'react';
import { useContext } from 'react';
import { PortfolioContext } from '../context/PortfolioContext';
import AddAssetForm from '../components/portfolio/AddAssetForm';
import PortfolioList from '../components/portfolio/PortfolioList';

const PortfolioPage = () => {
  const { portfolio } = useContext(PortfolioContext);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Manage Your Portfolio</h1>
      <h2>Add New Asset</h2>
      <AddAssetForm />
      <h2>Your Assets</h2>
      {portfolio.length > 0 ? (
        <PortfolioList />
      ) : (
        <p>No assets in your portfolio yet.</p>
      )}
    </div>
  );
};

export default PortfolioPage;