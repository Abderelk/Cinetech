import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { URL } from "./../../constant/api";

axios.defaults.withCredentials = true;

export const FilmContext = createContext();

export const FilmProvider = ({ children }) => {
  const [films, setFilms] = useState([]);
  const [filmsCount, setFilmsCount] = useState(0);
  const [filmsSelected, setFilmsSelected] = useState([]);

  // Fonction pour compter les films

  useEffect(() => {
    const countFilms = async () => {
      try {
        const { data, status } = await axios.get(URL.FILM_COUNT);
        if (status === 200) {
          setFilmsCount(data.count);
        } else {
          console.log("error while fetching count");
        }
      } catch (error) {
        console.log(error);
        console.log("error while fetching count");
      }
    };
    countFilms();
  }, []);

  /**
   * Fonction pour chercher les films
   * @param {*} param0  : objet contenant le numéro de la page
   * @returns : on stocke les films dans notre constante films ou on affiche un message d'erreur
   */

  const fetchFilms = async ({ page }) => {
    try {
      const { data, status } = await axios.get(URL.FILM_GET, {
        params: { page: page },
      });
      if (status === 200) {
        return setFilms(data);
      }
      console.log("error while fetching films", data, status);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Fonction pour chercher les films par term
   * @param {*} term : le terme de recherche
   * @returns : on stocke les films dans notre constante filmsSelected ou on affiche un message d'erreur
   */

  const searchFilmByTerm = async (term) => {
    try {
      console.log(term);
      const { data, status } = await axios.get(URL.FILM_SEARCH, {
        params: { term },
      });
      if (status === 200) {
        return setFilmsSelected(data);
      }
      console.log("error while fetching films", data, status);
    } catch (error) {
      console.log(error);
      console.log("error while fetching data");
    }
  };
  //  fonction pour compter le nombre de films, nécessaire pour la pagination

  return (
    <FilmContext.Provider
      value={{
        fetchFilms,
        films,
        filmsSelected,
        setFilmsSelected,
        searchFilmByTerm,
        filmsCount,
      }}
    >
      {children}
    </FilmContext.Provider>
  );
};
