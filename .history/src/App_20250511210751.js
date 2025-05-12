import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import ExcelEditor from './components/ExcelEditor';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="main-header">Automation Execution</div>
      <Routes>
        <Route path="/" element={<FileUpload />} />
        <Route path="/edit" element={<ExcelEditor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
