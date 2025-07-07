import React, { useState } from 'react';

function CsvSubstitutionTool() {
  const [inputList, setInputList] = useState('');
  const [pattern, setPattern] = useState('');
  const [results, setResults] = useState('');
  const [copyStatus, setCopyStatus] = useState('');

  const handleCalculate = () => {
    if (!inputList.trim() || !pattern.trim()) {
      setResults('');
      return;
    }

    // Split input into lines and filter out empty lines
    const lines = inputList.split('\n').filter(line => line.trim() !== '');
    
    const transformedLines = lines.map(line => {
      // Split the line by commas to get CSV columns
      const columns = line.split(',');
      
      // Replace numbered placeholders with column values
      let result = pattern;
      
      // Find all numbered placeholders like {0}, {1}, {2}, etc.
      const placeholderRegex = /\{(\d+)\}/g;
      
      result = result.replace(placeholderRegex, (match, columnIndex) => {
        const index = parseInt(columnIndex, 10);
        
        // Check if the column index exists
        if (index >= 0 && index < columns.length) {
          return columns[index];
        } else {
          return 'not found';
        }
      });
      
      return result;
    });
    
    setResults(transformedLines.join('\n'));
  };

  const handleCopyToClipboard = async () => {
    if (!results.trim()) return;
    
    try {
      await navigator.clipboard.writeText(results);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch (err) {
      setCopyStatus('Failed to copy');
      setTimeout(() => setCopyStatus(''), 2000);
    }
  };

  return (
    <div className="csv-substitution-tool">
      <header className="tool-header">
        <h1>CSV Substitution Tool</h1>
        <p>Transform CSV data using pattern substitution with numbered placeholders</p>
      </header>
      
      <main className="tool-main">
        <div className="input-section">
          <div className="text-area-container">
            <h2>For each row in this list</h2>
            <textarea
              value={inputList}
              onChange={(e) => setInputList(e.target.value)}
              placeholder="Enter CSV data here, one row per line (e.g., Ian,Test,123)..."
              className="text-area"
            />
          </div>
          
          <div className="text-area-container">
            <h2>Substitute using this pattern</h2>
            <textarea
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter your pattern here. Use {0}, {1}, {2} etc. for column values..."
              className="text-area"
            />
          </div>
          
          <button 
            onClick={handleCalculate}
            className="calculate-button"
            disabled={!inputList.trim() || !pattern.trim()}
          >
            Calculate
          </button>
        </div>
        
        <div className="results-section">
          <div className="results-header">
            <h2>Results</h2>
            {results.trim() && (
              <button 
                onClick={handleCopyToClipboard}
                className="copy-button"
                title="Copy to clipboard"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                {copyStatus || 'Copy'}
              </button>
            )}
          </div>
          <div className="results-container">
            <textarea
              value={results}
              readOnly
              placeholder="Results will appear here..."
              className="results-text-area"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default CsvSubstitutionTool; 