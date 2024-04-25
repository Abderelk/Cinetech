import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../constant/api";
axios.defaults.withCredentials = true;

export const FilmContext = createContext();
// fonctins pour normaliser les chaines de caractères
function normalizeString(str) {
  if (str === "" || typeof str === "undefined" || str === null) {
    return "";
  }

  return `${str}`
    ?.toLowerCase()
    ?.normalize("NFD")
    ?.replace(/[\u0300-\u036f]/g, "");
}
// provider pour les films
export const FilmProvider = ({ children }) => {
  const [films, setFilms] = useState([]);
  const [filmsSelected, setFilmsSelected] = useState([]);

  // fonctions pour récupérer les films
  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const { data, status } = await axios.get(URL.FILM_GET);
        if (status === 200) {
          return setFilms(data);
        }

        console.log("error while fetching films", data, status);
      } catch (error) {
        console.log(error);
        console.log("error while fetching data");
      }
    };

    fetchFilms();
  }, []);

  // fonctions pour rechercher un film par therme
  const searchFilmByTerm = (term) => {
    const termNormalized = normalizeString(term);
    const filmsFiletered = films.filter(
      (film) =>
        normalizeString(film.title).includes(termNormalized) ||
        normalizeString(film.originalTitle).includes(termNormalized) ||
        normalizeString(film.director).includes(termNormalized) ||
        normalizeString(film.genre).includes(termNormalized) ||
        normalizeString(film.synopsis).includes(termNormalized)
    );
    return setFilmsSelected(filmsFiletered.slice(0, 5));
  };

  return (
    <FilmContext.Provider
      value={{
        films,
        filmsSelected,
        searchFilmByTerm,
      }}
    >
      {children}
    </FilmContext.Provider>
  );
};
