import React, { createContext } from "react";
import axios from "axios";
import { URL } from "../constant/api";

export const UserContext = createContext();
export const UserProvider = ({ children }) => {
  /**
   * Ajouter un film à une rubrique
   * @param {*} filmId
   * @param {*} rubrique
   */

  const addToRubriques = async (filmId, rubrique) => {
    try {
      const { data } = await axios.post(URL.ADD_TORUBRIQUES, {
        filmId,
        rubrique,
      });
      return data;
    } catch (error) {
      console.log("Erreur lors de l'ajout du favoris", error);
      return data;
    }
  };

  /**
   * Supprimer un film d'une rubrique
   * @param {*} filmId
   * @param {*} rubrique
   * @returns
   */

  const removeFilmFromRubrique = async (filmId, rubrique) => {
    try {
      const removeResponse = await axios.post(URL.REMOVE_FROMRUBRIQUES, {
        rubrique: rubrique,
        filmId: filmId,
      });

      if (removeResponse.status === 200) {
        const getResponse = await axios.get(URL.GET_RUBRIQUES, {
          params: { rubrique: rubrique },
        });

        if (getResponse.status === 200) {
          return getResponse.data; // Retourner les données obtenues de l'appel à l'API
        }
      }
    } catch (error) {
      console.log(error);
      throw error; // Rejeter l'erreur pour la gérer où la fonction est appelée si nécessaire
    }
  };

  /**
   * Récupérer les films d'une rubrique
   * @param {*} rubrique
   * @returns
   */
  const getFilmsRubrique = async (rubrique) => {
    try {
      const { data, status } = await axios.get(URL.GET_RUBRIQUES, {
        params: { rubrique: rubrique },
      });
      if (status === 200) {
        return data;
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  return (
    <UserContext.Provider
      value={{
        addToRubriques,
        removeFilmFromRubrique,
        getFilmsRubrique,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
