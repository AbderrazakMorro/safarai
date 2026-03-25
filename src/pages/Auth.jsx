import React, { useState } from 'react';
import { ArrowRight, Mail, Lock } from 'lucide-react';
import './Auth.css';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-bg"></div>
      <div className="auth-card glass">
        <div className="auth-header">
          <div className="auth-logo-circle" style={{ margin: '0 auto 1.5rem auto' }}>
             <img src="/logo.png" alt="SafarAI" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}} />
          </div>
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p>{isLogin ? "Enter your details to access your trips." : "Start your journey with SafarAI."}</p>
        </div>

        <form className="auth-form" onSubmit={(e) => { e.preventDefault(); window.location.href='/'; }}>
          {!isLogin && (
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" required />
            </div>
          )}
          
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input type="email" placeholder="you@example.com" required />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input type="password" placeholder="••••••••" required />
            </div>
          </div>

          <button type="submit" className="auth-btn">
            {isLogin ? "Log In" : "Sign Up"} <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button className="switch-auth-btn" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
