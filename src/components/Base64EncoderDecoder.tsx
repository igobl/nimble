import React, { useState } from 'react';

function Base64EncoderDecoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copyStatus, setCopyStatus] = useState('');

  const handleEncode = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError('');
        return;
      }
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
      setError('');
    } catch (e: any) {
      setError('Encoding failed: ' + e.message);
      setOutput('');
    }
  };

  const handleDecode = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError('');
        return;
      }
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
      setError('');
    } catch (e: any) {
      setError('Decoding failed: Invalid Base64 string - ' + e.message);
      setOutput('');
    }
  };

  const handleCopyToClipboard = async () => {
    if (!output.trim()) return;
    
    try {
      await navigator.clipboard.writeText(output);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch (err) {
      setCopyStatus('Failed to copy');
      setTimeout(() => setCopyStatus(''), 2000);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
    setCopyStatus('');
  };

  return (
    <div className="base64-encoder-decoder-tool">
      <header className="tool-header">
        <h1>Base64 Encoder/Decoder Tool</h1>
        <p>Encode text to Base64 or decode Base64 strings back to text.</p>
      </header>
      
      <main className="tool-main">
        <div className="input-section">
          <div className="text-area-container">
            <h2>Input</h2>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to encode or Base64 string to decode..."
              className="text-area"
              rows={10}
            />
          </div>
          
          <div className="button-group">
            <button 
              onClick={handleEncode}
              className="calculate-button"
              disabled={!input.trim()}
            >
              Encode to Base64
            </button>
            <button 
              onClick={handleDecode}
              className="calculate-button"
              disabled={!input.trim()}
            >
              Decode from Base64
            </button>
            <button 
              onClick={clearAll}
              className="clear-button"
            >
              Clear All
            </button>
          </div>
          
          {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
        </div>
        
        <div className="results-section">
          <div className="results-header">
            <h2>Output</h2>
            {output.trim() && (
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
              value={output}
              readOnly
              placeholder="Encoded or decoded result will appear here..."
              className="results-text-area"
              rows={10}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Base64EncoderDecoder;

