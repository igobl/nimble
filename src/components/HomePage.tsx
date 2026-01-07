import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Nimble</h1>
        <p>Your toolkit for data transformation and manipulation</p>
      </header>
      
      <main className="home-main">
        <div className="tools-grid">
          <div className="tool-card">
            <h2>CSV Substitution Tool</h2>
            <p>Transform CSV data using pattern substitution with numbered placeholders like {0}, {1}, {2}, etc.</p>
            <Link to="/csv-substitution" className="tool-link">
              Open CSV Substitution Tool
            </Link>
          </div>
          
          <div className="tool-card">
            <h2>Line Removal Tool</h2>
            <p>Remove lines from text that contain specific IDs. Perfect for filtering scripts and data files.</p>
            <Link to="/line-removal" className="tool-link">
              Open Line Removal Tool
            </Link>
          </div>
          
          <div className="tool-card">
            <h2>JSON Prettifier Tool</h2>
            <p>Format and prettify your JSON for easier reading and debugging.</p>
            <Link to="/json-prettifier" className="tool-link">
              Open JSON Prettifier Tool
            </Link>
          </div>
          
          <div className="tool-card">
            <h2>Base64 Encoder/Decoder Tool</h2>
            <p>Encode text to Base64 or decode Base64 strings back to text.</p>
            <Link to="/base64-encoder-decoder" className="tool-link">
              Open Base64 Encoder/Decoder Tool
            </Link>
          </div>
          
        </div>
      </main>
    </div>
  );
}

export default HomePage; 