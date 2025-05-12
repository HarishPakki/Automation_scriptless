import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { DataGrid } from 'react-data-grid';
import './ExcelEditor.css';

function ExcelEditor() {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  // Example dropdown values for column 0 (you can customize)
  const dropdownOptions = {
    col_0: ['Pending', 'In Progress', 'Completed']
  };

  useEffect(() => {
    const sheetData = JSON.parse(localStorage.getItem('sheetData'));
    if (sheetData && sheetData.length > 0) {
      const headerRow = sheetData[0];

      const cols = headerRow.map((col, i) => {
        const key = `col_${i}`;
        if (dropdownOptions[key]) {
          return {
            key,
            name: col,
            editor: ({ row, onRowChange }) => (
              <select
                value={row[key] || ''}
                onChange={(e) => onRowChange({ ...row, [key]: e.target.value })}
              >
                <option value="">--Select--</option>
                {dropdownOptions[key].map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )
          };
        } else {
          return {
            key,
            name: col,
            editable: true
          };
        }
      });

      const formattedRows = sheetData.slice(1).map((row) => {
        const rowData = {};
        row.forEach((cell, i) => {
          rowData[`col_${i}`] = cell;
        });
        return rowData;
      });

      setColumns(cols);
      setRows(formattedRows);
    }
  }, []);

  const handleSave = () => {
    const headers = columns.map((col) => col.name);
    const data = rows.map((row) => columns.map((col) => row[col.key]));
    const finalData = [headers, ...data];
    const ws = XLSX.utils.aoa_to_sheet(finalData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, localStorage.getItem('excelName'));
    alert('Excel file updated successfully!');
  };

  const handleExecute = () => {
    alert('Custom Execute Logic Goes Here');
  };

  return (
    <div className="page-container">
      <h2>Edit Excel Data</h2>
      <DataGrid columns={columns} rows={rows} onRowsChange={setRows} className="custom-grid" />
      <div className="button-container">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleExecute}>Execute</button>
      </div>
    </div>
  );
}

export default ExcelEditor;
