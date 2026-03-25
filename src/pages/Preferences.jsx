import React, { useState } from 'react';
import { Settings as SettingsIcon, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import Card from '../components/Card';
import './Preferences.css';

export default function Preferences() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [prefs, setPrefs] = useState({
    climate: '',
    budget: '',
    duration: '',
    activities: []
  });

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleActivity = (act) => {
    setPrefs(prev => ({
      ...prev,
      activities: prev.activities.includes(act) 
        ? prev.activities.filter(a => a !== act)
        : [...prev.activities, act]
    }));
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="pref-step animate-in">
            <h3>What's your preferred climate? ☀️❄️</h3>
            <div className="options-grid">
              {['Tropical', 'Sunny & Warm', 'Mild', 'Cold & Snowy'].map(c => (
                <button 
                  key={c}
                  className={`option-btn ${prefs.climate === c ? 'selected' : ''}`}
                  onClick={() => setPrefs({...prefs, climate: c})}
                >
                  {c} {prefs.climate === c && <CheckCircle size={16} />}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="pref-step animate-in">
            <h3>What's your typical budget? 💰</h3>
            <div className="options-grid">
              {['Backpacker ($)', 'Moderate ($$)', 'Luxury ($$$)', 'Ultra Luxury ($$$$)'].map(b => (
                <button 
                  key={b}
                  className={`option-btn ${prefs.budget === b ? 'selected' : ''}`}
                  onClick={() => setPrefs({...prefs, budget: b})}
                >
                  {b} {prefs.budget === b && <CheckCircle size={16} />}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="pref-step animate-in">
            <h3>Ideal trip duration? ⏳</h3>
            <div className="options-grid">
              {['Weekend Getaway', '1 Week', '2 Weeks', '1 Month+'].map(d => (
                <button 
                  key={d}
                  className={`option-btn ${prefs.duration === d ? 'selected' : ''}`}
                  onClick={() => setPrefs({...prefs, duration: d})}
                >
                  {d} {prefs.duration === d && <CheckCircle size={16} />}
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="pref-step animate-in">
            <h3>Favorite activities? (Select multiple) 🏄‍♂️</h3>
            <div className="options-grid">
              {['Beaches', 'Hiking', 'Museums', 'Nightlife', 'Food Tours', 'Shopping'].map(a => (
                <button 
                  key={a}
                  className={`option-btn ${prefs.activities.includes(a) ? 'selected' : ''}`}
                  onClick={() => toggleActivity(a)}
                >
                  {a} {prefs.activities.includes(a) && <CheckCircle size={16} />}
                </button>
              ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="preferences-container page-content glass">
      <div className="pref-header">
        <div className="pref-title">
          <SettingsIcon size={28} className="text-primary" />
          <h2>Travel Preferences</h2>
        </div>
        <p>Help SafarAI tailor the best destination recommendations for you.</p>
      </div>

      <Card className="pref-card">
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
        </div>
        <div className="step-indicator">Step {step} of {totalSteps}</div>

        <div className="pref-content">
          {renderStep()}
        </div>

        <div className="pref-footer">
          <button 
            className="pref-nav-btn secondary-btn" 
            onClick={handlePrev} 
            disabled={step === 1}
          >
            <ChevronLeft size={18} /> Back
          </button>
          
          {step < totalSteps ? (
            <button 
              className="pref-nav-btn primary-btn" 
              onClick={handleNext}
            >
              Next <ChevronRight size={18} />
            </button>
          ) : (
            <button 
              className="pref-nav-btn primary-btn" 
              onClick={() => alert("Preferences Saved!")}
            >
              Save Preferences <CheckCircle size={18} />
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
