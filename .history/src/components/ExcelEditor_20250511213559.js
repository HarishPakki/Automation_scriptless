import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import './ExcelEditor.css';

function ExcelEditor() {
  const [sheetData, setSheetData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('sheetData'));
    const name = localStorage.getItem('excelName');
    if (stored) {
      setSheetData(stored.slice(1));
      setHeaders(stored[0]);
      setFileName(name);
    }
  }, []);

  const handleChange = (rowIndex, colIndex, value) => {
    const updated = [...sheetData];
    updated[rowIndex][colIndex] = value;
    setSheetData(updated);
  };

  const handleSave = () => {
    const finalData = [headers, ...sheetData];
    const ws = XLSX.utils.aoa_to_sheet(finalData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    const filePath = localStorage.getItem('excelPath');
    if (filePath) {
      XLSX.writeFile(wb, filePath); // ✅ write to original file
      alert('Saved to original Excel file successfully!');
    } else {
      alert('File path not found. Cannot save.');
    }
  };
  

  const handleExecute = () => {
    alert('Execute logic goes here');
  };

  return (
    <div className="excel-container">
      <h2>Edit Excel Data</h2>
      <div className="table-container">
        <table className="excel-table">
          <thead>
            <tr>
              {headers.map((head, colIndex) => (
                <th key={colIndex}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sheetData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((_, colIndex) => (
                  <td key={colIndex}>
                    <input
                      type="text"
                      value={row[colIndex] || ''}
                      onChange={(e) =>
                        handleChange(rowIndex, colIndex, e.target.value)
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="button-group">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleExecute}>Execute</button>
      </div>
    </div>
  );
}

export default ExcelEditor;
