import React, { useState } from 'react';
import { JsonView } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

const JsonPrettifierTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showInput, setShowInput] = useState(true);
  const [parsedJson, setParsedJson] = useState<any>(null);

  const handlePrettify = () => {
    try {
      const parsed = JSON.parse(input);
      const pretty = JSON.stringify(parsed, null, 2);
      setOutput(pretty);
      setParsedJson(parsed);
      setError('');
      setShowInput(false);
    } catch (e: any) {
      setError('Invalid JSON: ' + e.message);
      setOutput('');
      setParsedJson(null);
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
        {showInput && (
        <div className="input-section">
          <div className="text-area-container">
            <div className="results-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0 }}>Input JSON</h2>
              <button
                onClick={() => setShowInput(false)}
                className="copy-button"
                style={{ marginLeft: 8 }}
              >
                Hide Input
              </button>
            </div>
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
        )}
        <div className="results-section">
          <div className="results-header">
            <h2>Prettified JSON</h2>
            {!showInput && (
              <button
                onClick={() => setShowInput(true)}
                className="copy-button"
                style={{ marginLeft: 8 }}
              >
                Show Input
              </button>
            )}
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
          <div
            className={`results-container ${showInput ? 'collapsible-height maxh-400px' : 'expanded-100vh'}`.trim()}
          >
            {output && parsedJson ? (
              <div className={`results-text-area ${showInput ? '' : 'no-padding no-max-height fill-height full-vh'}`.trim()}>
                <div style={{ height: '100%', overflow: 'auto', textAlign: 'left' }}>
                  <JsonView
                    data={parsedJson}
                    shouldExpandNode={() => true}
                  />
                </div>
              </div>
            ) : (
              <textarea
                value={''}
                readOnly
                placeholder="Prettified JSON will appear here..."
                rows={10}
                className={`results-text-area ${showInput ? '' : 'no-max-height fill-height full-vh'}`.trim()}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default JsonPrettifierTool; 