import React, { useEffect, useState } from 'react';
import {
  discoverFields,
  findRowArrays,
  getValueAtPath,
  parseExtraFields,
  rowsToCsv,
  type RowArrayMatch,
} from '../jsonToCsv';

function pathLabel(path: string, length: number): string {
  const name = path === '' ? '(root)' : path;
  const rowWord = length === 1 ? 'row' : 'rows';
  return `${name} (${length} ${rowWord})`;
}

function getRows(data: unknown, path: string): unknown[] | null {
  const value = getValueAtPath(data, path);
  return Array.isArray(value) ? value : null;
}

function JsonToCsvTool() {
  const [input, setInput] = useState('');
  const [parsedData, setParsedData] = useState<unknown>(null);
  const [arrays, setArrays] = useState<RowArrayMatch[]>([]);
  const [arrayPath, setArrayPath] = useState('');
  const [error, setError] = useState('');
  const [discovered, setDiscovered] = useState<string[]>([]);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [extraFields, setExtraFields] = useState('');
  const [csv, setCsv] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [rowCount, setRowCount] = useState(0);
  const [columnCount, setColumnCount] = useState(0);

  useEffect(() => {
    setCsv('');

    if (parsedData === null) {
      setDiscovered([]);
      setChecked(new Set());
      setRowCount(0);
      return;
    }

    const rows = getRows(parsedData, arrayPath);
    if (!rows) {
      setDiscovered([]);
      setChecked(new Set());
      setRowCount(0);
      return;
    }

    const fields = discoverFields(rows);
    const nextFields = fields.length === 0 && rows.length > 0 ? ['value'] : fields;
    setDiscovered(nextFields);
    setChecked(new Set(nextFields));
    setRowCount(rows.length);
  }, [parsedData, arrayPath]);

  const handleParse = () => {
    try {
      const parsed = JSON.parse(input);
      const found = findRowArrays(parsed);
      const largest = found.reduce<RowArrayMatch | null>(
        (best, current) => (best === null || current.length > best.length ? current : best),
        null
      );

      setParsedData(parsed);
      setArrays(found);
      setArrayPath(largest ? largest.path : '');
      setCsv('');
      setError(
        found.length === 0
          ? 'No row arrays found — type a path.'
          : ''
      );
    } catch (e: any) {
      setError('Invalid JSON: ' + e.message);
      setParsedData(null);
      setArrays([]);
      setCsv('');
    }
  };

  const checkedFields = discovered.filter((field) => checked.has(field));
  const selectedFields = [
    ...checkedFields,
    ...parseExtraFields(extraFields).filter(
      (field) => !checkedFields.includes(field)
    ),
  ];

  const handleGenerate = () => {
    if (parsedData === null) {
      return;
    }

    const rows = getRows(parsedData, arrayPath);
    if (!rows) {
      const label = arrayPath === '' ? '(root)' : arrayPath;
      setError(`No array at \`${label}\`.`);
      setCsv('');
      return;
    }

    if (selectedFields.length === 0) {
      setError('Select at least one field to extract.');
      setCsv('');
      return;
    }

    setError('');
    setCsv(rowsToCsv(rows, selectedFields));
    setColumnCount(selectedFields.length);
  };

  const toggleField = (field: string) => {
    setChecked((current) => {
      const next = new Set(current);
      if (next.has(field)) {
        next.delete(field);
      } else {
        next.add(field);
      }
      return next;
    });
  };

  const handleCopy = async () => {
    if (!csv) {
      return;
    }
    try {
      await navigator.clipboard.writeText(csv);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch {
      setCopyStatus('Failed to copy');
      setTimeout(() => setCopyStatus(''), 2000);
    }
  };

  const handleDownload = () => {
    if (!csv) {
      return;
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'export.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDropdownChange = (path: string) => {
    setArrayPath(path);
    setError('');
  };

  const selectAllFields = () => {
    setChecked(new Set(discovered));
  };

  const deselectAllFields = () => {
    setChecked(new Set());
  };

  const allSelected = discovered.length > 0 && discovered.every((field) => checked.has(field));
  const noneSelected = discovered.every((field) => !checked.has(field));

  return (
    <div className="json-to-csv-tool">
      <header className="tool-header">
        <h1>JSON to CSV Tool</h1>
        <p>Paste JSON, pick the fields you want, and export them as CSV.</p>
      </header>

      <main className="tool-main">
        <div className="input-section">
          <div className="text-area-container">
            <h2>Input JSON</h2>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Paste JSON here — an array of objects, or a nested payload like { "data": { "items": [...] } }'
              className="text-area"
              rows={10}
            />
          </div>
          <button
            onClick={handleParse}
            className="calculate-button"
            disabled={!input.trim()}
          >
            Parse
          </button>
          {error && (
            <div className="tool-error">{error}</div>
          )}
        </div>

        {parsedData !== null && (
          <div className="input-section">
            <div className="text-area-container">
              <h2>Row array</h2>
              {arrays.length > 0 && (
                <select
                  className="json-to-csv-select"
                  value={
                    arrays.some((item) => item.path === arrayPath)
                      ? arrayPath
                      : '__custom__'
                  }
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      return;
                    }
                    handleDropdownChange(e.target.value);
                  }}
                >
                  {!arrays.some((item) => item.path === arrayPath) && (
                    <option value="__custom__">Custom path</option>
                  )}
                  {arrays.map((item) => (
                    <option key={item.path || '(root)'} value={item.path}>
                      {pathLabel(item.path, item.length)}
                    </option>
                  ))}
                </select>
              )}
              <input
                type="text"
                className="json-to-csv-path"
                value={arrayPath}
                onChange={(e) => {
                  setArrayPath(e.target.value);
                  setError('');
                }}
                placeholder="Or type a dotted path, e.g. data.items"
              />
              <p className="json-to-csv-hint">
                {rowCount} {rowCount === 1 ? 'row' : 'rows'} at this path
              </p>
            </div>

            <div className="text-area-container">
              <div className="json-to-csv-fields-header">
                <h2>Fields to extract</h2>
                {discovered.length > 0 && (
                  <div className="json-to-csv-actions">
                    <button
                      type="button"
                      className="copy-button"
                      onClick={selectAllFields}
                      disabled={allSelected}
                    >
                      Select all
                    </button>
                    <button
                      type="button"
                      className="copy-button"
                      onClick={deselectAllFields}
                      disabled={noneSelected}
                    >
                      Deselect all
                    </button>
                  </div>
                )}
              </div>
              {discovered.length === 0 ? (
                <p className="json-to-csv-hint">No fields discovered for this array.</p>
              ) : (
                <div className="json-to-csv-fields">
                  {discovered.map((field) => (
                    <label key={field} className="json-to-csv-field">
                      <input
                        type="checkbox"
                        checked={checked.has(field)}
                        onChange={() => toggleField(field)}
                      />
                      <span>{field}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="text-area-container">
              <h2>Extra dotted paths</h2>
              <textarea
                value={extraFields}
                onChange={(e) => setExtraFields(e.target.value)}
                placeholder={'One path per line, e.g.\naddress.city\nusers.0.email'}
                className="text-area"
                rows={4}
              />
            </div>

            <button
              onClick={handleGenerate}
              className="calculate-button"
              disabled={selectedFields.length === 0}
            >
              Generate CSV
            </button>
          </div>
        )}

        <div className="results-section">
          <div className="results-header">
            <h2>CSV{csv ? ` (${rowCount} × ${columnCount})` : ''}</h2>
            {csv && (
              <div className="json-to-csv-actions">
                <button
                  onClick={handleCopy}
                  className="copy-button"
                  title="Copy to clipboard"
                >
                  {copyStatus || 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="copy-button"
                  title="Download CSV"
                >
                  Download
                </button>
              </div>
            )}
          </div>
          <div className="results-container">
            <textarea
              value={csv}
              readOnly
              placeholder="CSV will appear here..."
              className="results-text-area"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default JsonToCsvTool;
