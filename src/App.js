import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import DeveloperPage from './DeveloperPage';
import FounderPage from './FounderPage'; // Create this for founders
import AuthPage from './AuthPage'; // Use for developer authentication
import Dashboard from './Dashboard'; // The new dashboard page
import FounderDashboard from './FounderDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/developer" element={<DeveloperPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} /> {/* New Dashboard Page */}
          <Route path="/founders" element={<FounderPage />} /> {/* New Founder Page */}
          <Route path="/founder-dashboard" element={<FounderDashboard />} />
          <Route path="/" element={
            <div className="home-page">
              <h1 className="title">CEO Meetie</h1>
              <div className="button-container">
                <Link to="/developer">
                  <button className="home-button">For Developers</button>
                </Link>
                <Link to="/founders">
                  <button className="home-button">For Founders</button>
                </Link>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
