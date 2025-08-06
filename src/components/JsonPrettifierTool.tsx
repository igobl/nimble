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

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h2>JSON Prettifier Tool</h2>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste or type your JSON here..."
        rows={10}
        style={{ width: '100%', fontFamily: 'monospace', marginBottom: 12 }}
      />
      <br />
      <button onClick={handlePrettify} style={{ marginBottom: 12 }}>Prettify</button>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <textarea
        value={output}
        readOnly
        placeholder="Prettified JSON will appear here..."
        rows={10}
        style={{ width: '100%', fontFamily: 'monospace', background: '#f6f8fa', marginBottom: 8 }}
      />
      <br />
      <button
        onClick={async () => {
          if (output) {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }
        }}
        disabled={!output}
        style={{ marginBottom: 8 }}
      >
        Copy to Clipboard
      </button>
      {copied && <span style={{ color: 'green', marginLeft: 8 }}>Copied!</span>}
    </div>
  );
};

export default JsonPrettifierTool; 