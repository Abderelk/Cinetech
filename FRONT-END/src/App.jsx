import { useContext } from 'react'
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Inscription from './pages/inscription';
import Home from './pages/films';
import MesFavoris from './pages/mesFavoris';
import AVoir from './pages/aVoir';
import DejaVues from './pages/dejaVues';
import HelloWorld from './pages/helloWorld';
import AuthMiddleware from '../middleware/AuthMiddleware';
import { AuthContext } from '../context/AuthContext';
import Loyout from './components/loyout/loyout';

function App() {

  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Loyout />} >
        <Route index element={<Home />} />
        <Route path="/helloWorld" element={<HelloWorld />} />
        <Route path="/inscription" element={<AuthMiddleware isAuthenticated={!isLoggedIn}>< Inscription /></AuthMiddleware>} />
        <Route path="/login" element={<AuthMiddleware isAuthenticated={!isLoggedIn}> <Login /> </AuthMiddleware>} />
        <Route path="/mes-favoris" element={<AuthMiddleware isAuthenticated={isLoggedIn}> <MesFavoris /> </AuthMiddleware>} />
        <Route path="/a-voir" element={<AuthMiddleware isAuthenticated={isLoggedIn}><AVoir /></AuthMiddleware>} />
        <Route path="/deja-vues" element={<AuthMiddleware isAuthenticated={isLoggedIn}><DejaVues /></AuthMiddleware>} />
      </Route>
    </Routes>
  )
}

export default App
