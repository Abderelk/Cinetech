import React, { useState, useEffect, useContext } from "react";
// lien des pages et requêtes API
import { URL } from "../../../constant/api.js";
import axios from "axios";
// redux
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDataSuccess,
  fetchDataFailure,
} from "../../../redux/film.reducer.js";
// contexte d'authentification
import { AuthContext } from "../../../context/AuthContext.jsx";
// contexte film
import { FilmContext } from "../../../context/FilmContext.jsx";
// contexte utilisateur
import { UserContext } from "../../../context/UserContext.jsx";
// chargement de pages
import LoadingSpinner from "../../components/loading/loadingSpinner.jsx";
// film
import Film from "../../components/film/film.jsx";
// icones

const Home = () => {
  // importation des fonctions et états du contexte d'authentification
  const { checkAuthStatus, isLoggedIn } = useContext(AuthContext);
  const { filmSelected, films } = useContext(FilmContext);
  // importation des fonctions et états du contexte utilisateur
  const { addFavoris, addAVoir, addVues } = useContext(UserContext);

  console.log(filmSelected);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleAddFavoris = async (event, oneFilm) => {
    event.preventDefault();
    try {
      addFavoris(oneFilm);
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddAVoir = async (event, oneFilm) => {
    event.preventDefault();
    try {
      addAVoir(oneFilm);
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddVues = async (event, oneFilm) => {
    event.preventDefault();
    try {
      addVues(oneFilm);
    } catch (error) {
      console.log(error);
    }
  };

  const [selectedFilm, setSelectedFilm] = useState(null);
  const handleToggleSynopsis = (filmId) => {
    setSelectedFilm(selectedFilm === filmId ? null : filmId);
  };

  return (
    <div className="px-20 py-2">
      <main className="min-h-80">
        {/* Affichage du film recherché */}
        {filmSelected && filmSelected._id && (
          <div
            className="bg-gray rounded-md p-5 m-3 hover:scale-105"
            key={filmSelected._id}
          >
            <Film
              oneFilm={filmSelected}
              selectedFilm={selectedFilm}
              handleAddAVoir={handleAddAVoir}
              handleAddFavoris={handleAddFavoris}
              handleAddVues={handleAddVues}
              handleToggleSynopsis={handleToggleSynopsis}
            />
          </div>
        )}

        {/* Affichage de tous les films */}
        <h2 className="text-3xl font-bold border-b-2 border-red inline-block">
          Tous les films
        </h2>
        {
          <div className="grid grid-cols-3 gap-4">
            {films.length === 0 && <LoadingSpinner />}
            {films.map((oneFilm, index) => (
              <div
                className="bg-gray rounded-md p-5 m-3 hover:scale-105"
                key={oneFilm._id}
              >
                <Film
                  oneFilm={oneFilm}
                  selectedFilm={selectedFilm}
                  handleAddAVoir={handleAddAVoir}
                  handleAddFavoris={handleAddFavoris}
                  handleAddVues={handleAddVues}
                  handleToggleSynopsis={handleToggleSynopsis}
                  isLoggedIn={isLoggedIn}
                />
              </div>
            ))}
          </div>
        }
      </main>
    </div>
  );
};

export default Home;
