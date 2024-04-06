import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URL } from "../constant/api";
axios.defaults.withCredentials = true

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);



    const checkAuthStatus = async () => {
        try {
            const response = await axios.get(URL.USER_CHECK_AUTH);
            setIsLoggedIn(response.data.isLoggedIn);
        } catch (error) {
            console.error("Erreur lors de la vérification du statut d'authentification", error);
        }
    };

    const login = async (userData) => {
        try {
            const { data, status } = await axios.post(URL.USER_LOGIN, userData);
            if (status === 200) {
                setUser(data);
                console.log("Connexion réussie", data);
                // navigate('/');
                setIsLoggedIn(true);
            } else {
                console.log("Erreur lors de la connexion");
            }
        } catch (error) {
            console.log("Erreur lors de la connexion ", error);
        }
    };
    const logout = async () => {
        try {
            const { data, status } = await axios.get(URL.USER_LOGOUT);
            if (status === 200) {
                console.log("Déconnexion réussie", data);
                setIsLoggedIn(false);
            } else {
                console.log("Erreur lors de la déconnexion");
            }
        } catch (error) {
            console.log("Erreur lors de la déconnexion", error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoggedIn, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};
