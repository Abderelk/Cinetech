import React, { createContext } from "react";
import Axios from "axios";
import { URL } from "../constant/api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const addFavoris = async (filmId) => {
    try {
      const { data, status } = await Axios.post(URL.ADD_FAVORIS, { filmId });
      if (status === 201) {
        console.log("Favoris ajouté", data);
      } else {
        console.log("Erreur lors de l'ajout du favoris");
      }
    } catch (error) {
      console.log("Erreur lors de l'ajout du favoris", error);
    }
  };
  const addVues = async (filmId) => {
    try {
      const { status, data } = await Axios.post(URL.ADD_VUES, { filmId });
      if (status === 201) {
        console.log("films ajoutées à la rubirique vues", data);
      } else {
        console.log("Erreur lors de l'ajout des vues");
      }
    } catch (error) {
      console.log("Erreur lors de l'ajout des vues", error);
    }
  };
  const addAVoir = async (filmId) => {
    try {
      const { status, data } = await Axios.post(URL.ADD_AVOIR, { filmId });
      if (status === 201) {
        console.log("films ajoutées à la rubirique à voir", data);
      } else {
        console.log("Erreur lors de l'ajout des vues");
      }
    } catch (error) {
      console.log("Erreur lors de l'ajout des vues", error);
    }
  };
  const removeFavoris = async (filmId) => {
    try {
      const { data, status } = await Axios.post(URL.REMOVE_FAVORIS, { filmId });
      if (status === 200) {
        console.log("Favoris supprimé", data);
      } else {
        console.log("Erreur lors de la suppression du favoris");
      }
    } catch (error) {
      console.log("Erreur lors de la suppression du favoris", error);
    }
  };
  const removeVues = async (filmId) => {
    try {
      const { status, data } = await Axios.post(URL.REMOVE_VUES, { filmId });
      if (status === 200) {
        console.log("films supprimées de la rubirique vues", data);
      } else {
        console.log("Erreur lors de la suppression des vues");
      }
    } catch (error) {
      console.log("Erreur lors de la suppression des vues", error);
    }
  };
  const removeAVoir = async (filmId) => {
    try {
      const { status, data } = await Axios.post(URL.REMOVE_AVOIR, { filmId });
      if (status === 200) {
        console.log("films supprimées de la rubirique à voir", data);
      } else {
        console.log("Erreur lors de la suppression des vues");
      }
    } catch (error) {
      console.log("Erreur lors de la suppression des vues", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        addFavoris,
        addVues,
        addAVoir,
        removeAVoir,
        removeFavoris,
        removeVues,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
