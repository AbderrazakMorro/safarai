import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Global Styles
import './App.css';

// Contexts
import { ConsentProvider } from './contexts/ConsentContext';

// Components
import Layout from './components/Layout';
import CookieConsent from './components/CookieConsent';
import FloatingChat from './components/FloatingChat';

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
import Activities from './pages/Activities';
import SavedPlaces from './pages/SavedPlaces';
import Community from './pages/Community';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

function App() {
  return (
    <ConsentProvider>
      <Router>
        <Routes>
          {/* Landing & Auth - Full screen, no layout container */}
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          
          {/* Main App Layout */}
          <Route path="*" element={
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/destinations" element={<Destinations />} />
                <Route path="/activities" element={<Activities />} />
                <Route path="/community" element={<Community />} />
                <Route path="/trips" element={<TripPlanner />} />
                <Route path="/favorites" element={<SavedPlaces />} />
                <Route path="/settings" element={<Preferences />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/backpack" element={<SmartBackpack />} />
              </Routes>
            </Layout>
          } />
        </Routes>
        <FloatingChat />
        <CookieConsent />
      </Router>
    </ConsentProvider>
  );
}

export default App;
