import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URL } from "../constant/api";
axios.defaults.withCredentials = true

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // initialisation de l'état de connexion
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const navigate = useNavigate();
    const [user, setUser] = useState("")
    // fonctions pour s'inscrire
    const signIn = async (newUser) => {
        try {
            const { data, status } = await axios.post(URL.USER_SIGNUP, newUser)
            if (status === 201) {
                console.log("inscription réussie", data)
                navigate('/login')
            } else {
                console.log('erreur lors de l\'inscription')
            }
        } catch (error) {
            console.log("erreur lors de l'inscription", error)
        }
    }

    // fonction pour se connecter
    const login = async (userData) => {
        try {
            const { data, status } = await axios.post(URL.USER_LOGIN, userData);
            if (status === 200) {
                console.log("Connexion réussie", data);
                navigate('/');
                checkAuthStatus();
            } else {
                console.log("Erreur lors de la connexion");
            }
        } catch (error) {
            console.log("Erreur lors de la connexion ", error);
        }
    };


    // fonction pour checker la connexion
    const checkAuthStatus = async () => {
        try {
            const response = await axios.get(URL.USER_CHECK_AUTH);
            setIsLoggedIn(response.data.isLoggedIn);
            setUser(response.data.username)
        } catch (error) {
            console.error("Erreur lors de la vérification du statut d'authentification", error);
        }
    };
    // fonction pour se déconnecter
    const logout = async () => {
        try {
            const { data, status } = await axios.get(URL.USER_LOGOUT);
            if (status === 200) {
                console.log("Déconnexion réussie", data);
                checkAuthStatus();
            } else {
                console.log("Erreur lors de la déconnexion");
            }
        } catch (error) {
            console.log("Erreur lors de la déconnexion", error);
        }
    }



    return (
        // 
        <AuthContext.Provider value={{ login, logout, isLoggedIn, checkAuthStatus, signIn, user }}>
            {children}
        </AuthContext.Provider>
    );
};
