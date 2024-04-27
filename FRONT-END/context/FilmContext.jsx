import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../constant/api";
axios.defaults.withCredentials = true;

export const FilmContext = createContext();
// provider pour les films
export const FilmProvider = ({ children }) => {
  const [films, setFilms] = useState([]);
  const [filmsCount, setFilmsCount] = useState(0);
  const [filmsSelected, setFilmsSelected] = useState([]);

  // fonctions pour récupérer les films
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
      console.log("error while fetching data");
    }
  };

  // fonctions pour rechercher un film par therme
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

  // comptes des films
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

  return (
    <FilmContext.Provider
      value={{
        fetchFilms,
        films,
        filmsSelected,
        searchFilmByTerm,
        filmsCount,
      }}
    >
      {children}
    </FilmContext.Provider>
  );
};
