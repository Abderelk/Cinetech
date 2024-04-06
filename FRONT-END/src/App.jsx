import { useState, useEffect } from 'react'
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/login';
import Inscription from './pages/inscription';
import Films from './pages/films';
function App() {

  return (
    <Routes>
      <Route path="/" element={<Films />} />
      <Route path="/inscription" element={<Inscription />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
