import React, { useState, useEffect, useContext } from "react";
// lien des pages et requêtes API
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
import { FaCircleXmark } from "react-icons/fa6";
// pagination
import Pagination from "../../components/pagination/pagination.jsx";
const Home = () => {
  const [page, setPage] = useState(1);
  // importation des fonctions et états du contexte d'authentification
  const { checkAuthStatus, isLoggedIn } = useContext(AuthContext);
  const { filmsSelected, setFilmsSelected, films, fetchFilms, filmsCount } =
    useContext(FilmContext);
  // importation des fonctions et états du contexte utilisateur
  const { addFavoris, addAVoir, addVues } = useContext(UserContext);

  useEffect(() => {
    checkAuthStatus();
  }, []);
  // fonctions pour ajouter un film à la liste des favoris, à voir ou vus
  useEffect(() => {
    fetchFilms({ page });
  }, [page]);
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

  // fonctions pour afficher les details du film
  const [selectedFilm, setSelectedFilm] = useState(null);
  const handleToggleSynopsis = (filmId) => {
    setSelectedFilm(selectedFilm === filmId ? null : filmId);
  };

  // calculs du nombre de pages pour la pagination
  const filmsPerPage = filmsCount;
  const numberOfPages = Math.ceil(filmsPerPage / 20);

  const handleCloseSearch = () => {
    setFilmsSelected([]);
  };
  return (
    <div className="px-20 py-2">
      <main className="min-h-80">
        {/* Affichage du film recherché */}
        {filmsSelected.length > 0 && (
          <div className="flex justify-between my-5">
            <h2 className="text-3xl font-bold border-b-2 border-red inline-block">
              Film recherché
            </h2>
            <button onClick={handleCloseSearch}>
              <FaCircleXmark className="text-4xl" />
            </button>
          </div>
        )}
        <div className="grid grid-cols-5 gap-4">
          {filmsSelected.length > 0 &&
            filmsSelected.map((filmSelected, index) => (
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
                  isLoggedIn={isLoggedIn}
                />
              </div>
            ))}
        </div>

        {/* Affichage de tous les films */}
        <h2 className="text-3xl font-bold border-b-2 border-red inline-block my-5">
          Tous les films
        </h2>
        {
          <div className="grid grid-cols-5 gap-4">
            {films.length === 0 && <LoadingSpinner />}
            {films.map((oneFilm, index) => (
              <div
                className="bg-opacity-5 bg-gray rounded-md p-5 m-3 hover:scale-105"
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
        {/* pagination */}
        <div className="flex justify-center mt-4">
          <Pagination
            numberOfPages={numberOfPages}
            page={page}
            setPage={setPage}
          />
        </div>

        <div className="flex justify-center items-center"></div>
      </main>
    </div>
  );
};

export default Home;
