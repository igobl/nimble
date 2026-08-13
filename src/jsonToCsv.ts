export type RowArrayMatch = {
  path: string;
  length: number;
};

export function findRowArrays(data: unknown): RowArrayMatch[] {
  if (Array.isArray(data)) {
    return [{ path: '', length: data.length }];
  }

  const results: RowArrayMatch[] = [];
  collectArrays(data, '', results);
  return results;
}

function collectArrays(
  node: unknown,
  path: string,
  results: RowArrayMatch[]
): void {
  if (node === null || typeof node !== 'object' || Array.isArray(node)) {
    return;
  }

  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    const childPath = path ? `${path}.${key}` : key;
    if (Array.isArray(value)) {
      results.push({ path: childPath, length: value.length });
    } else {
      collectArrays(value, childPath, results);
    }
  }
}

export function getValueAtPath(data: unknown, path: string): unknown {
  if (path === '') {
    return data;
  }

  let current: unknown = data;
  for (const segment of path.split('.')) {
    if (current === null || current === undefined) {
      return undefined;
    }

    if (Array.isArray(current)) {
      const index = Number(segment);
      if (!Number.isInteger(index)) {
        return undefined;
      }
      current = current[index];
      continue;
    }

    if (typeof current !== 'object') {
      return undefined;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return current;
}

export function discoverFields(rows: unknown[]): string[] {
  const seen = new Set<string>();
  const fields: string[] = [];

  const add = (fieldPath: string) => {
    if (!seen.has(fieldPath)) {
      seen.add(fieldPath);
      fields.push(fieldPath);
    }
  };

  const walkObject = (obj: Record<string, unknown>, prefix: string) => {
    for (const [key, value] of Object.entries(obj)) {
      const fieldPath = prefix ? `${prefix}.${key}` : key;
      add(fieldPath);
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        walkObject(value as Record<string, unknown>, fieldPath);
      }
    }
  };

  for (const row of rows) {
    if (row !== null && typeof row === 'object' && !Array.isArray(row)) {
      walkObject(row as Record<string, unknown>, '');
    }
  }

  return fields;
}

export function parseExtraFields(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export function rowsToCsv(rows: unknown[], fields: string[]): string {
  const header = fields.map(formatCell).join(',');
  const body = rows.map((row) =>
    fields.map((field) => formatCell(getRowField(row, field))).join(',')
  );
  return [header, ...body].join('\n');
}

function getRowField(row: unknown, field: string): unknown {
  if (row !== null && typeof row === 'object' && !Array.isArray(row)) {
    return getValueAtPath(row, field);
  }
  return field === 'value' ? row : undefined;
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  const text = typeof value === 'object' ? JSON.stringify(value) : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}
