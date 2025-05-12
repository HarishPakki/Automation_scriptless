import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

function FileUpload() {
  const [fileName, setFileName] = useState('');
  const navigate = useNavigate();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const path = file.path; // ✅ get actual path
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const sheetName = wb.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1 });

      localStorage.setItem('excelPath', path);          // ✅ store real path
      localStorage.setItem('excelName', file.name);     // just for display
      localStorage.setItem('sheetData', JSON.stringify(sheetData));

      navigate('/edit');
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="page-container">
      <h2>Upload Excel File</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFile} />
      <p>{fileName && `Uploaded: ${fileName}`}</p>
    </div>
  );
}

export default FileUpload;
