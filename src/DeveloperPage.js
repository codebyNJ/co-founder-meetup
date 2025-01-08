import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import './DeveloperPage.css';

function DeveloperPage() {
  const navigate = useNavigate();  // Create the navigate function

  const handleNavigate = (route) => {
    navigate(route);  // Use navigate to go to the route
  };

  return (
    <div className="developer-page">
      <h1 className="developer-title">Developer Dashboard</h1>
      <p>Welcome, developer! You can log in or sign up to get started.</p>
      <div className="button-container">
        <button className="action-button" onClick={() => handleNavigate('/login')}>
          Login
        </button>
      </div>
    </div>
  );
}

export default DeveloperPage;
