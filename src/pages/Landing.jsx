import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Sparkles, Shield, Plane, Star, Globe, CloudSun, CheckCircle } from 'lucide-react';
import './Landing.css';

export default function Landing() {
  const features = [
    { icon: <Sparkles size={28} />, title: "AI-Powered Planning", desc: "Smart itineraries tailored to your preferences, budget, and travel style." },
    { icon: <CloudSun size={28} />, title: "Weather Intelligence", desc: "Real-time weather data integrated into every recommendation and packing list." },
    { icon: <MapPin size={28} />, title: "Destination Discovery", desc: "Explore curated destinations with insider tips and local experiences." },
    { icon: <Shield size={28} />, title: "Smart Packing", desc: "AI-generated checklists based on your destination, weather, and activities." },
  ];

  const destinations = [
    { name: "Santorini", country: "Greece", image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&q=80&w=600", rating: "4.8" },
    { name: "Kyoto", country: "Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600", rating: "4.9" },
    { name: "Bali", country: "Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600", rating: "4.6" },
  ];

  const testimonials = [
    { name: "Sarah M.", text: "SafarAI planned my entire honeymoon in 10 minutes. The packing list was perfect!", avatar: "S" },
    { name: "James K.", text: "The AI recommendations were spot-on. Found hidden gems I'd never have discovered.", avatar: "J" },
    { name: "Aisha R.", text: "Best travel app I've ever used. The weather integration is a game-changer.", avatar: "A" },
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-brand">
            <div className="landing-logo">
              <img src="/logo.png" alt="SafarAI" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}} />
            </div>
            <span className="landing-logo-text">Safar<span style={{color: 'var(--accent)'}}>AI</span></span>
          </div>
          <div className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#destinations">Destinations</a>
            <a href="#testimonials">Reviews</a>
          </div>
          <div className="landing-nav-actions">
            <Link to="/login" className="nav-login-btn">Log In</Link>
            <Link to="/onboarding" className="nav-signup-btn">Get Started <ArrowRight size={16} /></Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} /> Powered by AI
          </div>
          <h1>Travel Smarter,<br /><span className="gradient-text">Not Harder.</span></h1>
          <p className="hero-subtitle">
            SafarAI is your intelligent travel companion that plans perfect trips, discovers hidden destinations, and packs your bags — all powered by artificial intelligence.
          </p>
          <div className="hero-cta-group">
            <Link to="/onboarding" className="hero-cta-primary">
              Start Planning Free <ArrowRight size={18} />
            </Link>
            <a href="#features" className="hero-cta-secondary">
              <Globe size={18} /> See How It Works
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Trips Planned</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-number">120+</span>
              <span className="stat-label">Countries</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-number">4.9</span>
              <span className="stat-label">User Rating</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card glass">
            <div className="hero-card-image">
              <img src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=600" alt="Beach destination" />
            </div>
            <div className="hero-card-body">
              <span className="hero-card-badge"><Sparkles size={12} /> AI Pick</span>
              <h3>Maldives Escape</h3>
              <p><MapPin size={14} /> South Malé Atoll &bull; 7 Days</p>
            </div>
          </div>
          <div className="floating-widget widget-weather glass">
            <CloudSun size={20} style={{ color: 'var(--accent)' }} />
            <div>
              <span className="fw-title">28°C Sunny</span>
              <span className="fw-sub">Perfect weather</span>
            </div>
          </div>
          <div className="floating-widget widget-packing glass">
            <CheckCircle size={20} style={{ color: '#48BB78' }} />
            <div>
              <span className="fw-title">Packing Ready</span>
              <span className="fw-sub">12 items checked</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-header">
          <span className="section-badge">Features</span>
          <h2>Everything You Need for the <span className="gradient-text">Perfect Trip</span></h2>
          <p>From destination discovery to smart packing, SafarAI handles every detail.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card glass">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Destinations Section */}
      <section className="destinations-section" id="destinations">
        <div className="section-header">
          <span className="section-badge">Top Destinations</span>
          <h2>Trending Places to <span className="gradient-text">Explore</span></h2>
          <p>Handpicked destinations loved by our community.</p>
        </div>
        <div className="dest-showcase">
          {destinations.map((d, i) => (
            <div key={i} className="dest-showcase-card">
              <img src={d.image} alt={d.name} />
              <div className="dest-overlay">
                <div className="dest-overlay-info">
                  <h3>{d.name}</h3>
                  <p>{d.country}</p>
                </div>
                <span className="dest-overlay-rating"><Star size={14} fill="currentColor" /> {d.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section" id="testimonials">
        <div className="section-header">
          <span className="section-badge">Testimonials</span>
          <h2>Loved by <span className="gradient-text">Travelers</span></h2>
          <p>See what our users are saying about their SafarAI experience.</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card glass">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="#F6AD55" color="#F6AD55" />)}
              </div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.avatar}</div>
                <span>{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content glass">
          <Plane size={48} className="cta-icon" />
          <h2>Ready to Plan Your Next Adventure?</h2>
          <p>Join 50,000+ travelers who plan smarter with SafarAI.</p>
          <Link to="/onboarding" className="cta-btn">
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="landing-logo small">
              <img src="/logo.png" alt="SafarAI" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}} />
            </div>
            <span className="landing-logo-text">Safar<span style={{color: 'var(--accent)'}}>AI</span></span>
          </div>
          <p className="footer-tagline">Your intelligent travel companion.</p>
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#destinations">Destinations</a>
            <a href="#testimonials">Reviews</a>
            <Link to="/login">Login</Link>
          </div>
          <p className="footer-copy">&copy; 2026 SafarAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
