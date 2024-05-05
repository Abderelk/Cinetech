import React, { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/login/login";
import Inscription from "./pages/inscription/inscription";
import HelloWorld from "./pages/helloWorld/helloWorld";
import Home from "./pages/home/home";
import MesFavoris from "./pages/favoris/mesFavoris";
import AVoir from "./pages/aVoir/aVoir";
import DejaVues from "./pages/vue/dejaVue";
import ADeuxPas from "./pages/aDeuxPas/aDeuxPas";
import Loading from "./components/loading/loading";
import AuthMiddleware from "../middleware/AuthMiddleware";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";
import Layout from "./components/layout/layout";
import LayoutAuth from "./components/layout/layoutAuth";

function App() {
  const { isLoggedIn, isLoading, checkAuthStatus, getUserLocation } =
    useContext(AuthContext);

  const { getFestivalsNearUser } = useContext(UserContext);

  // Pour vérifier si l'utilisateur est connecté dès le chargement de l'app et faire une page de chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      checkAuthStatus();
    }, 700);
    return () => clearTimeout(timer);
  }, []);
  // Pour charger la position de l'utilisateur dès le chargement de l'app
  useEffect(() => {
    getUserLocation();
    getFestivalsNearUser();
  }, []);

  if (isLoading) {
    return (
      <Routes>
        <Route path="/" element={<Loading />} />
        <Route path="/login" element={<Loading />} />
        <Route path="/inscription" element={<Loading />} />
        <Route path="/mes-favoris" element={<Loading />} />
        <Route path="/a-voir" element={<Loading />} />
        <Route path="/deja-vues" element={<Loading />} />
        <Route path="/a-deux-pas" element={<Loading />} />
      </Routes>
    );
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
        <Route
          path="/a-deux-pas"
          element={
            <AuthMiddleware isAuthenticated={isLoggedIn}>
              <ADeuxPas />
            </AuthMiddleware>
          }
        />
      </Route>
      <Route path="/helloWorld" element={<HelloWorld />} />
    </Routes>
  );
}

export default App;
