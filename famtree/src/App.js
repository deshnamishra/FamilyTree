// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TreePage from './pages/TreePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tree" element={<TreePage />} />
        {/* Legacy route */}
        <Route path="/tree/:treeId" element={<TreePage />} />
      </Routes>
    </Router>
  );
}

export default App;