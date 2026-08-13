import {
  discoverFields,
  findRowArrays,
  getValueAtPath,
  parseExtraFields,
  rowsToCsv,
} from './jsonToCsv';

describe('findRowArrays', () => {
  test('returns the root when JSON is an array of objects', () => {
    const data = [
      { id: 1, email: 'a@x.com' },
      { id: 2, email: 'b@x.com' },
    ];

    expect(findRowArrays(data)).toEqual([{ path: '', length: 2 }]);
  });

  test('finds nested arrays of objects by dotted path', () => {
    const data = {
      data: {
        items: [{ id: 1 }, { id: 2 }, { id: 3 }],
      },
    };

    expect(findRowArrays(data)).toEqual([{ path: 'data.items', length: 3 }]);
  });

  test('finds multiple arrays on an object', () => {
    const data = {
      users: [{ id: 1 }],
      tags: ['a', 'b'],
    };

    expect(findRowArrays(data)).toEqual([
      { path: 'users', length: 1 },
      { path: 'tags', length: 2 },
    ]);
  });

  test('returns an empty list when there are no arrays', () => {
    expect(findRowArrays({ name: 'Ada' })).toEqual([]);
  });
});

describe('getValueAtPath', () => {
  test('returns the value at a dotted path', () => {
    const data = { data: { items: [{ id: 1 }] } };
    expect(getValueAtPath(data, 'data.items')).toEqual([{ id: 1 }]);
  });

  test('returns the data itself for an empty path', () => {
    const data = [{ id: 1 }];
    expect(getValueAtPath(data, '')).toBe(data);
  });

  test('returns undefined when a path segment is missing', () => {
    expect(getValueAtPath({ data: {} }, 'data.items')).toBeUndefined();
  });

  test('walks into array indexes', () => {
    expect(getValueAtPath({ users: [{ email: 'a@x.com' }] }, 'users.0.email')).toBe(
      'a@x.com'
    );
  });
});

describe('discoverFields', () => {
  test('collects top-level keys in first-seen order', () => {
    const rows = [
      { id: 1, email: 'a@x.com' },
      { id: 2, role: 'admin' },
    ];

    expect(discoverFields(rows)).toEqual(['id', 'email', 'role']);
  });

  test('flattens nested objects into dotted paths', () => {
    const rows = [{ id: 1, address: { city: 'Dublin', country: 'IE' } }];

    expect(discoverFields(rows)).toEqual([
      'id',
      'address',
      'address.city',
      'address.country',
    ]);
  });

  test('does not flatten array-valued properties', () => {
    const rows = [{ id: 1, tags: ['a', 'b'] }];

    expect(discoverFields(rows)).toEqual(['id', 'tags']);
  });

  test('skips non-object rows', () => {
    expect(discoverFields([1, 'x', null])).toEqual([]);
  });
});

describe('parseExtraFields', () => {
  test('splits extra fields on newlines and ignores blanks', () => {
    expect(parseExtraFields('id\n\nemail\n  role  ')).toEqual([
      'id',
      'email',
      'role',
    ]);
  });
});

describe('rowsToCsv', () => {
  test('writes a header and one row per object', () => {
    const rows = [
      { id: 1, email: 'a@x.com' },
      { id: 2, email: 'b@x.com' },
    ];

    expect(rowsToCsv(rows, ['id', 'email'])).toBe(
      'id,email\n1,a@x.com\n2,b@x.com'
    );
  });

  test('uses an empty cell when a field is missing', () => {
    expect(rowsToCsv([{ id: 1 }], ['id', 'email'])).toBe('id,email\n1,');
  });

  test('JSON-stringifies object and array cell values', () => {
    expect(rowsToCsv([{ tags: ['a', 'b'] }], ['tags'])).toBe(
      'tags\n"[""a"",""b""]"'
    );
  });

  test('quotes cells that contain commas, quotes, or newlines', () => {
    expect(rowsToCsv([{ name: 'Ada, Lovelace' }], ['name'])).toBe(
      'name\n"Ada, Lovelace"'
    );
    expect(rowsToCsv([{ name: 'Say "hi"' }], ['name'])).toBe(
      'name\n"Say ""hi"""'
    );
    expect(rowsToCsv([{ name: 'line1\nline2' }], ['name'])).toBe(
      'name\n"line1\nline2"'
    );
  });

  test('reads nested fields via dotted paths', () => {
    const rows = [{ address: { city: 'Dublin' } }];
    expect(rowsToCsv(rows, ['address.city'])).toBe('address.city\nDublin');
  });

  test('treats primitive rows as a single value column', () => {
    expect(rowsToCsv([1, 2, 3], ['value'])).toBe('value\n1\n2\n3');
  });
});
