import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "../constant/api";
axios.defaults.withCredentials = true;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  /**
   * Fonction pour s'inscrire
   * @param {*} newUser : objet contenant les informations de l'utilisateur
   */

  const signIn = async (newUser) => {
    try {
      const { data, status } = await axios.post(URL.USER_SIGNUP, newUser);
      if (status === 201) {
        navigate("/login");
        console.log(data.message);
        return data.message;
      }
    } catch (error) {
      return error.response.data;
    }
  };

  /**
   * Fonction pour se connecter
   * @param {*} userData : objet contenant les informations de connexion
   */

  const login = async (userData) => {
    try {
      const { data, status } = await axios.post(URL.USER_LOGIN, userData);
      if (status === 200) {
        // navigate("/");
        checkAuthStatus();
      }
      return data;
    } catch (error) {
      return error.response.data;
    }
  };

  /**
   * Fonction pour vérifier le statut d'authentification
   */

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(URL.USER_CHECK_AUTH);
      setIsLoggedIn(response.data.isLoggedIn);
      setUser(response.data.username);
      setIsCheckingAuth(false);
    } catch (error) {
      console.error(
        "Erreur lors de la vérification du statut d'authentification",
        error
      );
      setIsCheckingAuth(false);
    }
  };

  /**
   * Fonction pour se déconnecter
   */

  const logout = async () => {
    try {
      const { data, status } = await axios.get(URL.USER_LOGOUT);
      if (status === 200) {
        checkAuthStatus();
      } else {
        console.log("Erreur lors de la déconnexion");
      }
    } catch (error) {
      console.log("Erreur lors de la déconnexion", error);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        isLoggedIn,
        checkAuthStatus,
        signIn,
        user,
        isCheckingAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
