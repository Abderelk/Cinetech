import React from "react";
import { Navigate } from "react-router-dom";

const AuthMiddleware = ({ isAuthenticated, children }) => {
  // Si l'utilisateur est authentifié, afficher le composant enfants sinon rediriger vers la page d'accueil
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default AuthMiddleware;
