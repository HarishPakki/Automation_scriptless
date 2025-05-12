import React, { useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'objectRepository';

const ObjectRepositoryTable = () => {
  const [rows, setRows] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      setRows(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage on blur
  const handleBlur = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rows));
  };

  const handleAddRow = () => {
    setRows(prev => [...prev, { key: '', value: '' }]);
  };

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  return (
    <div className='object-repository-table' style={{ padding: '1rem' }}>
      <button onClick={handleAddRow}>+ key value</button>
      <table className="excel-table" style={{ marginTop: '1rem', width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Key</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              <td>
                <input
                  type="text"
                  value={row.key}
                  onChange={e => handleChange(idx, 'key', e.target.value)}
                  onBlur={handleBlur}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.value}
                  onChange={e => handleChange(idx, 'value', e.target.value)}
                  onBlur={handleBlur}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ObjectRepositoryTable;