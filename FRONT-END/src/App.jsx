import { useState, useEffect } from 'react'
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/login';
import Inscription from './pages/inscription';
import Films from './pages/films';
import MesFavoris from './pages/mesFavoris';
import AVoir from './pages/aVoir';
import DejaVues from './pages/dejaVues';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Films />} />
      <Route path="/inscription" element={<Inscription />} />
      <Route path="/login" element={<Login />} />
      <Route path="/mes-favoris" element={<MesFavoris />} />
      <Route path="/a-voir" element={<AVoir />} />
      <Route path="/deja-vues" element={<DejaVues />} />
    </Routes>
  )
}

export default App
