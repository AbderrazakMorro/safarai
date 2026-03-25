import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import './App.css';

// Real views
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Destinations from './pages/Destinations';
import TripPlanner from './pages/TripPlanner';
import Preferences from './pages/Preferences';
import Profile from './pages/Profile';
import SmartBackpack from './pages/SmartBackpack';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';

// Placeholder views
const Favorites = () => <div className="page-content glass"><h2>Favorites</h2><p>Your saved locations</p></div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing & Auth - Full screen, no sidebar/navbar */}
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Auth />} />
        
        {/* Main App Layout */}
        <Route path="*" element={
          <div className="app-container">
            <Sidebar />
            <main className="main-content">
              <Navbar />
              <div className="content-area">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/destinations" element={<Destinations />} />
                  <Route path="/trips" element={<TripPlanner />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/settings" element={<Preferences />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/backpack" element={<SmartBackpack />} />
                </Routes>
              </div>
            </main>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
