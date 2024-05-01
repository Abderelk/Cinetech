import React, { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/login/login";
import Inscription from "./pages/inscription/inscription";
import Home from "./pages/home/home";
import MesFavoris from "./pages/favoris/mesFavoris";
import AVoir from "./pages/aVoir/aVoir";
import DejaVues from "./pages/vue/dejaVue";
import HelloWorld from "./pages/helloWorld/helloWorld";
import AuthMiddleware from "../middleware/AuthMiddleware";
import { AuthContext } from "../context/AuthContext";
import Layout from "./components/layout/layout";
import LayoutAuth from "./components/layout/layoutAuth";
import { useState } from "react";
import LoadingSpinner from "./components/loading/loadingSpinner";
function App() {
  const { isLoggedIn, isCheckingAuth, checkAuthStatus } =
    useContext(AuthContext);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  // On vérifie le statut d'authentification
  useEffect(() => {
    checkAuthStatus();
  }, []);
  // On vérifie si l'authentification est en cours
  useEffect(() => {
    if (!isCheckingAuth) {
      setIsAuthLoading(false);
    }
  }, [isCheckingAuth]);
  // Si l'authentification est en cours, afficher le spinner de chargement
  if (isAuthLoading) {
    return <LoadingSpinner />;
  }
  return (
    <Routes>
      <Route element={<LayoutAuth />}>
        <Route
          path="/inscription"
          element={
            <AuthMiddleware isAuthenticated={!isLoggedIn}>
              <Inscription />
            </AuthMiddleware>
          }
        />
        <Route
          path="/login"
          element={
            <AuthMiddleware isAuthenticated={!isLoggedIn}>
              <Login />
            </AuthMiddleware>
          }
        />
      </Route>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="/mes-favoris"
          element={
            <AuthMiddleware isAuthenticated={isLoggedIn}>
              <MesFavoris />
            </AuthMiddleware>
          }
        />
        <Route
          path="/a-voir"
          element={
            <AuthMiddleware isAuthenticated={isLoggedIn}>
              <AVoir />
            </AuthMiddleware>
          }
        />
        <Route
          path="/deja-vues"
          element={
            <AuthMiddleware isAuthenticated={isLoggedIn}>
              <DejaVues />
            </AuthMiddleware>
          }
        />
      </Route>
      <Route path="/helloWorld" element={<HelloWorld />} />
    </Routes>
  );
}

export default App;
