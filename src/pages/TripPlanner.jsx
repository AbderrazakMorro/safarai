import React, { useState } from 'react';
import { Calendar, Share2, Users, GripVertical, CheckSquare, Square, Plus } from 'lucide-react';
import Card from '../components/Card';
import AIWidget from '../components/AIWidget';
import './TripPlanner.css';

const MOCK_ITINERARY = [
  { id: 1, day: "Day 1", date: "Oct 12", activities: ["Check-in at resort", "Beach walk", "Seafood dinner"] },
  { id: 2, day: "Day 2", date: "Oct 13", activities: ["Scuba diving", "Local market tour"] },
  { id: 3, day: "Day 3", date: "Oct 14", activities: ["Spa day", "Sunset cruise"] }
];

const MOCK_PACKING = [
  { category: "Clothing", items: [{ name: "Swimwear", packed: true }, { name: "Evening wear", packed: false }, { name: "Light jacket", packed: false }] },
  { category: "Essentials", items: [{ name: "Passport", packed: true }, { name: "Sunscreen", packed: false }] }
];

export default function TripPlanner() {
  const [activeTab, setActiveTab] = useState('itinerary');

  return (
    <div className="trip-planner-container page-content glass">
      <div className="trip-header">
        <div className="trip-info">
          <h2>Maldives Getaway</h2>
          <span className="trip-dates"><Calendar size={16} /> Oct 12 - Oct 18</span>
        </div>
        <div className="trip-actions">
          <button className="icon-btn"><Users size={18} /> Collab</button>
          <button className="icon-btn"><Share2 size={18} /> Share</button>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'itinerary' ? 'active' : ''}`}
          onClick={() => setActiveTab('itinerary')}
        >
          Itinerary
        </button>
        <button 
          className={`tab-btn ${activeTab === 'packing' ? 'active' : ''}`}
          onClick={() => setActiveTab('packing')}
        >
          Smart Packing
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'itinerary' && (
          <div className="itinerary-view">
            <div className="timeline">
              {MOCK_ITINERARY.map((day) => (
                <Card key={day.id} className="timeline-card">
                  <div className="day-header">
                    <h4>{day.day}</h4>
                    <span className="day-date">{day.date}</span>
                  </div>
                  <div className="activities-list">
                    {day.activities.map((act, idx) => (
                      <div key={idx} className="activity-item">
                        <GripVertical size={16} className="drag-handle" />
                        <span className="activity-name">{act}</span>
                      </div>
                    ))}
                    <button className="add-activity-btn"><Plus size={16} /> Add Activity</button>
                  </div>
                </Card>
              ))}
            </div>
            <div className="itinerary-sidebar">
               <AIWidget 
                  title="Itinerary Optimization" 
                  suggestion="Swap Scuba diving to Day 3 for better weather conditions." 
               />
            </div>
          </div>
        )}

        {activeTab === 'packing' && (
          <div className="packing-view">
            <div className="packing-header">
              <h3>AI-Generated Checklist</h3>
              <p>Based on 28°C Sunny weather in Maldives.</p>
            </div>
            <div className="packing-grid">
              {MOCK_PACKING.map((category, idx) => (
                <Card key={idx} className="packing-card">
                  <h4>{category.category}</h4>
                  <ul className="packing-list">
                    {category.items.map((item, i) => (
                      <li key={i} className={`packing-item ${item.packed ? 'packed' : ''}`}>
                         {item.packed ? <CheckSquare size={18} className="text-primary" /> : <Square size={18} className="text-secondary" />}
                         <span>{item.name}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
