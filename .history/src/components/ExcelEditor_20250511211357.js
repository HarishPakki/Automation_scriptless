import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import DataGrid from 'react-data-grid';
import { DataGrid } from 'react-data-grid'; // ✅ correct for v7+

function ExcelEditor() {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const sheetData = JSON.parse(localStorage.getItem('sheetData'));
    if (sheetData && sheetData.length > 0) {
      setColumns(
        sheetData[0].map((col, i) => ({
          key: `col_${i}`,
          name: col,
          editable: true,
        }))
      );
      const formattedRows = sheetData.slice(1).map((row) => {
        const rowData = {};
        row.forEach((cell, i) => {
          rowData[`col_${i}`] = cell;
        });
        return rowData;
      });
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

  return (
    <div className="page-container">
      <h2>Edit Excel Data</h2>
      <DataGrid
        columns={columns}
        rows={rows}
        onRowsChange={setRows}
      />
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleSave}>Save</button>
        <button onClick={() => alert('Execute logic goes here!')}>Execute</button>
      </div>
    </div>
  );
}

export default ExcelEditor;
