import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom';
import Login from './pages/login/login';
import Inscription from './pages/inscription/inscription';
import Home from './pages/home/home';
import MesFavoris from './pages/favoris/mesFavoris';
import AVoir from './pages/aVoir/aVoir';
import DejaVues from './pages/vue/dejaVue';
import HelloWorld from './pages/helloWorld/helloWorld';
import AuthMiddleware from '../middleware/AuthMiddleware';
import { AuthContext } from '../context/AuthContext';
import Layout from './components/layout/layout';

function App() {

  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Layout />} >
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
