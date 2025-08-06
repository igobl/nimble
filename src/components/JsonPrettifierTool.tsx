import React, { useState } from 'react';

const JsonPrettifierTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handlePrettify = () => {
    try {
      const parsed = JSON.parse(input);
      const pretty = JSON.stringify(parsed, null, 2);
      setOutput(pretty);
      setError('');
    } catch (e: any) {
      setError('Invalid JSON: ' + e.message);
      setOutput('');
    }
  };

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="json-prettifier-tool">
      <header className="tool-header">
        <h1>JSON Prettifier Tool</h1>
        <p>Format and prettify your JSON for easier reading and debugging.</p>
      </header>
      <main className="tool-main">
        <div className="input-section">
          <div className="text-area-container">
            <h2>Input JSON</h2>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Paste or type your JSON here..."
              rows={10}
              className="text-area"
            />
          </div>
          <button
            onClick={handlePrettify}
            className="calculate-button"
            style={{ marginTop: 12 }}
            disabled={!input.trim()}
          >
            Prettify
          </button>
          {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
        </div>
        <div className="results-section">
          <div className="results-header">
            <h2>Prettified JSON</h2>
            {output && (
              <button
                onClick={handleCopy}
                className="copy-button"
                style={{ marginLeft: 8 }}
              >
                Copy to Clipboard
              </button>
            )}
            {copied && <span style={{ color: 'green', marginLeft: 8 }}>Copied!</span>}
          </div>
          <div className="results-container">
            <textarea
              value={output}
              readOnly
              placeholder="Prettified JSON will appear here..."
              rows={10}
              className="results-text-area"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default JsonPrettifierTool; 