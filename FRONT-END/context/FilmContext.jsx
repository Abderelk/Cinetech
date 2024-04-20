import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../constant/api";
axios.defaults.withCredentials = true;

export const FilmContext = createContext();


export const FilmProvider = ({ children }) => {
  const [films, setFilms] = useState([]);
  const [filmSelected, setFilmSelected] = useState(null);

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

  const searchFilmById = (id) => {
    console.log("searchFilmById", id, films);
    return setFilmSelected(films.find((film) => film._id === Number(id)));
  };

  return (
    <FilmContext.Provider
      value={{
        films,
        filmSelected,
        searchFilmById,
      }}
    >
      {children}
    </FilmContext.Provider>
  );
};
