import React, { useState } from 'react';

function LineRemovalTool() {
  const [inputText, setInputText] = useState('');
  const [idList, setIdList] = useState('');
  const [results, setResults] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [stats, setStats] = useState<{
    linesRemoved: number;
    unusedIds: string[];
    totalInputLines: number;
    totalOutputLines: number;
  } | null>(null);

  const handleProcess = () => {
    if (!inputText.trim() || !idList.trim()) {
      setResults('');
      setStats(null);
      return;
    }

    // Parse the list of IDs
    const idsToRemove = idList
      .split('\n')
      .map(id => id.trim())
      .filter(id => id !== '');

    // Split input into lines
    const inputLines = inputText.split('\n').filter(line => line.trim() !== '');
    const totalInputLines = inputLines.length;

    // Track which IDs were found and used
    const foundIds = new Set<string>();
    const linesToKeep: string[] = [];

    // Process each line
    inputLines.forEach(line => {
      let shouldKeepLine = true;
      
      // Check if any ID from the list is present in this line
      for (const id of idsToRemove) {
        if (line.includes(id)) {
          shouldKeepLine = false;
          foundIds.add(id);
          break;
        }
      }
      
      if (shouldKeepLine) {
        linesToKeep.push(line);
      }
    });

    // Find unused IDs (IDs that were not found in any line)
    const unusedIds = idsToRemove.filter(id => !foundIds.has(id));
    
    const linesRemoved = totalInputLines - linesToKeep.length;
    const totalOutputLines = linesToKeep.length;

    setResults(linesToKeep.join('\n'));
    setStats({
      linesRemoved,
      unusedIds,
      totalInputLines,
      totalOutputLines
    });
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

  const clearAll = () => {
    setInputText('');
    setIdList('');
    setResults('');
    setStats(null);
    setCopyStatus('');
  };

  return (
    <div className="line-removal-tool">
      <header className="tool-header">
        <h1>Line Removal Tool</h1>
        <p>Remove lines that contain specific IDs from your text</p>
      </header>
      
      <main className="tool-main">
        <div className="input-section">
          <div className="text-area-container">
            <h2>Input Text (Script/Data)</h2>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your text here, one line per entry...&#10;Example:&#10;update mytable where id = 123&#10;update mytable where id = 124&#10;update mytable where id = 142"
              className="text-area"
            />
          </div>
          
          <div className="text-area-container">
            <h2>IDs to Remove (One per line)</h2>
            <textarea
              value={idList}
              onChange={(e) => setIdList(e.target.value)}
              placeholder="Enter IDs to remove, one per line...&#10;Example:&#10;123&#10;127&#10;128"
              className="text-area"
            />
          </div>
          
          <div className="button-group">
            <button 
              onClick={handleProcess}
              className="calculate-button"
              disabled={!inputText.trim() || !idList.trim()}
            >
              Process
            </button>
            <button 
              onClick={clearAll}
              className="clear-button"
            >
              Clear All
            </button>
          </div>
        </div>
        
        {stats && (
          <div className="stats-section">
            <h2>Processing Statistics</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Total Input Lines:</span>
                <span className="stat-value">{stats.totalInputLines}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Lines Removed:</span>
                <span className="stat-value removed">{stats.linesRemoved}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Lines Kept:</span>
                <span className="stat-value kept">{stats.totalOutputLines}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Unused IDs:</span>
                <span className="stat-value unused">{stats.unusedIds.length}</span>
              </div>
            </div>
            
            {stats.unusedIds.length > 0 && (
              <div className="unused-ids">
                <h3>IDs Not Found in Input:</h3>
                <div className="id-list">
                  {stats.unusedIds.map((id, index) => (
                    <span key={index} className="id-tag">{id}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
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

export default LineRemovalTool; 