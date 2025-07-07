import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          Nimble
        </Link>
        
        <div className="nav-links">
          {location.pathname !== '/' && (
            <Link to="/" className="nav-link">
              ← Back to Home
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation; 