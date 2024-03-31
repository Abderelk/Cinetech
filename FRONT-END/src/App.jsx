import { useState, useEffect } from 'react'
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/login';
import Inscription from './pages/inscription';
import Home from './pages/home';
import Films from './pages/films';
import Film from './pages/film';
function App() {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/inscription" element={<Inscription />} />
      <Route path="/home" element={<Home />} />
      <Route path="/films" element={<Films />} />
      <Route path="/film" element={<Film />} />
    </Routes>
  )
}

export default App
