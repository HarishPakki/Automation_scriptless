import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

function FileUpload() {
  const [fileName, setFileName] = useState('');
  const navigate = useNavigate();

  // const handleFile = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const path = file.path; // ✅ get actual path
  //   setFileName(file.name);

  //   const reader = new FileReader();
  //   reader.onload = (evt) => {
  //     const bstr = evt.target.result;
  //     const wb = XLSX.read(bstr, { type: 'binary' });
  //     const sheetName = wb.SheetNames[0];
  //     const sheetData = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1 });

  //     localStorage.setItem('excelPath', path);          // ✅ store real path
  //     localStorage.setItem('excelName', file.name);     // just for display
  //     localStorage.setItem('sheetData', JSON.stringify(sheetData));

  //     navigate('/edit');
  //   };

  //   reader.readAsBinaryString(file);
  // };

  const handleFileUpload = async() => {
    const filePath = await window.electronAPI.openFileDialog();
    if (!filePath) return;

    try {
      const buffer = window.electronAPI.readFile(filePath);
      const workbook = XLSX.read(buffer, { type: 'buffer' });

      const allSheetData = {};

      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Get data as 2D array
        allSheetData[sheetName] = data;
      });

      const name = filePath.split(/[/\\]/).pop();
      setFileName(name);

      localStorage.setItem('excelPath', filePath);
      localStorage.setItem('excelName', name);
      localStorage.setItem('sheetData', JSON.stringify(allSheetData)); // Save all sheets

      navigate('/edit');
    } catch (error) {
      console.error('Failed to read file:', error);
      alert('Error reading Excel file.');
    }
  };

  return (
    <div className="page-container">
      <h2>Upload Excel File</h2>
      {/* <input type="file" accept=".xlsx, .xls" onChange={handleFile} /> */}
      <button onClick={handleFileUpload}>Choose file </button>
      <p>{fileName && `Uploaded: ${fileName}`}</p>
    </div>
  );
}

export default FileUpload;
