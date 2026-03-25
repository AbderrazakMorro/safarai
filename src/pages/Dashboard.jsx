import React from 'react';
import { Compass, Map, Heart, Calendar } from 'lucide-react';
import Card from '../components/Card';
import AIWidget from '../components/AIWidget';
import WeatherWidget from '../components/WeatherWidget';
import './Dashboard.css';

export default function Dashboard() {
  const userName = "Alex";

  const quickActions = [
    { icon: <Compass size={24} />, label: "Plan Trip", color: "var(--primary)" },
    { icon: <Map size={24} />, label: "Explore", color: "var(--accent)" },
    { icon: <Heart size={24} />, label: "Saved", color: "#F56565" },
    { icon: <Calendar size={24} />, label: "Timeline", color: "var(--secondary)" }
  ];

  return (
    <div className="dashboard-container page-content glass">
      <div className="dashboard-header">
        <div className="greeting-section">
          <h2>Welcome back, {userName}! 👋</h2>
          <p>Where are we flying to next?</p>
        </div>
        <WeatherWidget temp="28" condition="Sunny" location="Current Location" />
      </div>

      <div className="quick-actions-grid">
        {quickActions.map((action, idx) => (
          <Card key={idx} hoverable className="quick-action-card">
            <div className="action-icon" style={{ color: action.color, background: `${action.color}20` }}>
              {action.icon}
            </div>
            <span className="action-label">{action.label}</span>
          </Card>
        ))}
      </div>

      <div className="dashboard-main-grid">
        <div className="main-col">
          <h3>AI Suggestions</h3>
          <AIWidget 
            title="Recommended for you" 
            suggestion="Based on your love for beaches, we recommend exploring the Maldives next month. The weather is perfect and flights are 15% cheaper." 
            onAction={() => console.log('Explore')}
          />
          <div style={{ marginTop: '1.5rem' }}>
            <AIWidget 
              title="Smart Packing Tip" 
              suggestion="It looks like you're heading to a colder climate soon. Don't forget your thermal wear!" 
            />
          </div>
        </div>
        <div className="side-col">
          <h3>Recent Activity</h3>
          <Card className="activity-card">
            <ul className="activity-list">
              <li>
                <div className="activity-dot"></div>
                <div className="activity-details">
                  <span className="activity-title">Saved 'Kyoto Temples'</span>
                  <span className="activity-time">2 hours ago</span>
                </div>
              </li>
              <li>
                <div className="activity-dot"></div>
                <div className="activity-details">
                  <span className="activity-title">Updated preferences</span>
                  <span className="activity-time">Yesterday</span>
                </div>
              </li>
              <li>
                <div className="activity-dot"></div>
                <div className="activity-details">
                  <span className="activity-title">Viewed flights to Paris</span>
                  <span className="activity-time">3 days ago</span>
                </div>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
