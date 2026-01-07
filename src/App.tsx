import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import CsvSubstitutionTool from './components/CsvSubstitutionTool';
import LineRemovalTool from './components/LineRemovalTool';
import JsonPrettifierTool from './components/JsonPrettifierTool';
import Base64EncoderDecoder from './components/Base64EncoderDecoder';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/csv-substitution" element={<CsvSubstitutionTool />} />
          <Route path="/line-removal" element={<LineRemovalTool />} />
          <Route path="/json-prettifier" element={<JsonPrettifierTool />} />
          <Route path="/base64-encoder-decoder" element={<Base64EncoderDecoder />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
