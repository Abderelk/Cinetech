import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthMiddleware = ({ isAuthenticated, children }) => {

    // Si l'utilisateur est authentifié, afficher le composant enfants
    // Sinon, rediriger vers la page de connexion
    return isAuthenticated ? children : <Navigate to="/" />;
};

export default AuthMiddleware;

