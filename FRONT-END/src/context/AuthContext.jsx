import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "./../../constant/api";
axios.defaults.withCredentials = true;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState({});

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
      setIsLoading(false);
    } catch (error) {
      console.error(
        "Erreur lors de la vérification du statut d'authentification",
        error
      );
      setIsLoading(false);
    }
  };

  /**
   * Fonction pour se déconnecter
   */

  const logout = async () => {
    try {
      const { status } = await axios.get(URL.USER_LOGOUT);
      if (status === 200) {
        checkAuthStatus();
      } else {
        console.log("Erreur lors de la déconnexion");
      }
    } catch (error) {
      console.log("Erreur lors de la déconnexion", error);
    }
  };

  /**
   * Fonction pour récupérer la localisation de l'utilisateur
   */
  const getUserLocation = async () => {
    try {
      navigator.geolocation.getCurrentPosition(function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setUserLocation({ latitude: latitude, longitude: longitude });
      });
    } catch (error) {
      console.log(error);
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
        isLoading,
        userLocation,
        getUserLocation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
