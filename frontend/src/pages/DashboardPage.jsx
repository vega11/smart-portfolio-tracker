// src/pages/DashboardPage.jsx
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { PortfolioContext } from '../context/PortfolioContext';
import LogoutButton from '../components/auth/LogoutButton';
import PortfolioList from '../components/portfolio/PortfolioList';
import PriceChart from '../components/charts/PriceChart';
import PortfolioPieChart from '../components/charts/PortfolioPieChart';
import AddAssetForm from '../components/portfolio/AddAssetForm';
import SellAssetForm from '../components/portfolio/SellAssetForm';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const { portfolio, loading, error } = useContext(PortfolioContext);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSellForm, setShowSellForm] = useState(false);

  if (!user) {
    return <div>You are not logged in.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome, {user?.username || 'Guest'}!</h1>
      <LogoutButton />

      {/* Buttons for Add and Sell Assets */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            marginRight: '10px',
            padding: '10px 15px',
            backgroundColor: '#36A2EB',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {showAddForm ? 'Hide Add Asset Form' : 'Add Asset'}
        </button>
        <button
          onClick={() => setShowSellForm(!showSellForm)}
          style={{
            padding: '10px 15px',
            backgroundColor: '#FF6384',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {showSellForm ? 'Hide Sell Asset Form' : 'Sell Asset'}
        </button>
      </div>

      {/* Add Asset Form */}
      {showAddForm && <AddAssetForm />}

      {/* Sell Asset Form */}
      {showSellForm && <SellAssetForm />}

      <h2>Portfolio Summary</h2>
      {loading ? (
        <p>Loading portfolio...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <PortfolioList portfolio={portfolio} />
      )}
      <h2>Price Trends</h2>
      <PriceChart priceData={[]} /> {/* Replace with real data if available */}
      <h2>Portfolio Distribution</h2>
      <PortfolioPieChart portfolio={portfolio} />
    </div>
  );
};

export default DashboardPage;