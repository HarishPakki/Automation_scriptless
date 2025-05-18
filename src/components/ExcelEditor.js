import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import './ExcelEditor.css';
import ObjectRepositoryTable from './ObjectRepositoryTable';
import TreeView from './TreeView/TreeView';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { Tooltip } from '@mui/material';

function ExcelEditor() {
  const [allSheets, setAllSheets] = useState({});
  const [currentSheetName, setCurrentSheetName] = useState('');
  const [sheetData, setSheetData] = useState([]);
  const [sheetDataCopy, setSheetDataCopy] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fileName, setFileName] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState({}); // Store dropdown options for cells
  const [showObjectRepository, setShowObjectRepository] = useState(false);

  const arrowActionsStyles={
    marginRight: showObjectRepository ? "-17px" : '-5px'
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('sheetData'));
    const name = localStorage.getItem('excelName');
    if (stored) {
      setAllSheets(stored);
      const defaultSheet = Object.keys(stored)[0];
      setCurrentSheetName(defaultSheet);
      updateSheet(stored[defaultSheet]);
      setFileName(name);
      extractDropdownOptions(stored[defaultSheet]); // Extract dropdown options on initial load
    }
  }, []);

  const updateSheet = (data) => {
    if (!data || data.length === 0) {
      setHeaders([]);
      setSheetData([]);
    } else {
      setHeaders(data[0]);
      setSheetData(data.slice(1));
      setSheetDataCopy(data.slice(1));
    }
  };

  // Extract dropdown options from the sheet data
  const extractDropdownOptions = (sheetData) => {
    const options = {};

    // Iterate over the headers to detect "dropdown" columns
    headers.forEach((header, colIndex) => {
      if (header.toLowerCase() === 'dropdown') {
        // Collect options for this column
        const dropdownList = sheetData.map((row) => row[colIndex]).filter((item, idx, arr) => arr.indexOf(item) === idx); // Get unique values for the dropdown
        options[colIndex] = dropdownList; // Store dropdown options by column index
      }
    });

    setDropdownOptions(options);
  };

  const handleSheetChange = (sheetName) => {
    setCurrentSheetName(sheetName);
    updateSheet(allSheets[sheetName]);
    extractDropdownOptions(allSheets[sheetName]); // Re-extract dropdown options for the selected sheet
  };

  const handleChange = (rowIndex, colIndex, value) => {
    const updated = [...sheetData];
    updated[rowIndex][colIndex] = value;
    setSheetData(updated);

    // Update in allSheets too
    const updatedAllSheets = { ...allSheets };
    updatedAllSheets[currentSheetName] = [headers, ...updated];
    setAllSheets(updatedAllSheets);
  };

  const handleSave = () => {
    const path = localStorage.getItem('excelPath');
    if (!path) {
      alert('Excel path not found!');
      return;
    }

    try {
      const wb = XLSX.utils.book_new();

      Object.entries(allSheets).forEach(([sheetName, data]) => {
        const ws = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      });

      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

      window.electronAPI.writeFile(path, wbout);
      alert('Excel updated successfully at: ' + path);
    } catch (err) {
      console.error('Error saving file:', err);
      alert('Failed to save. Make sure the file is closed in Excel.');
    }
  };

  const handleExecute = () => {
    alert('Execute logic goes here');
  };

  const handleDrop = (e, rowIdx, colIdx) => {
    console.log("handleDrop",rowIdx, colIdx);
    e.preventDefault();
    const value = e.dataTransfer.getData("text/plain");
    console.log("DROPPED VALUE",value);
    handleChange(rowIdx,colIdx,value);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow drop
  };

  const renderCell = (rowIndex, colIndex, value) => {
    const dropdownList = dropdownOptions[colIndex];

    if (dropdownList) {
      return (
        <select
          value={value || ''}
          onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
        >
          {dropdownList.map((option, idx) => (
            <option key={idx} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
        onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
        onDragOver={handleDragOver}
      />
    );
  };

  const handleSearch=(event)=>{
    console.log(sheetDataCopy);
    const searchValue = event.target.value;
    if(!searchValue) {
      setSheetData(sheetDataCopy);
    } else{
      const filteredData = sheetDataCopy.filter(subArray =>
        subArray.some(item =>
          item && item.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
      setSheetData(filteredData);
    }
  };

  return (
    <div className='excel-editor-container'>
      <div className='tree-view'>
        <TreeView />
      </div>
      <div className="excel-container">
        <h2>Edit Excel File: {fileName}</h2>

        <div className="table-container">
          <input className='search-input' placeholder='Search...' onChange={handleSearch} />
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
                  {row.map((cell, colIndex) => (
                    <td key={colIndex}>
                      <Tooltip title={cell} arrow placement="top">
                        {renderCell(rowIndex, colIndex, cell)} {/* Render dropdown or input */}
                      </Tooltip>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sheet-tabs">
          {Object.keys(allSheets).map((sheetName) => (
            <button
              key={sheetName}
              className={`sheet-tab ${sheetName === currentSheetName ? 'active' : ''}`}
              onClick={() => handleSheetChange(sheetName)}
            >
              {sheetName}
            </button>
          ))}
        </div>

        <div className="button-group">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleExecute}>Execute</button>
        </div>
      </div>

      {/* Object Repository Table */}
      <div className='arrows-actions' style={arrowActionsStyles}>
        <ArrowRightIcon className='arrow arrow-right' onClick={() => setShowObjectRepository(!showObjectRepository)} />
        <ArrowLeftIcon className='arrow' onClick={() => setShowObjectRepository(!showObjectRepository)} />
      </div>
      {
        showObjectRepository && (
          <ObjectRepositoryTable />
        )
      }
    </div>
  );
}

export default ExcelEditor;
