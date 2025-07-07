import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import CsvSubstitutionTool from './components/CsvSubstitutionTool';
import LineRemovalTool from './components/LineRemovalTool';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/csv-substitution" element={<CsvSubstitutionTool />} />
          <Route path="/line-removal" element={<LineRemovalTool />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
