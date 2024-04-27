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
// pagination

const Home = () => {
  // pagination
  const [page, setPage] = useState(1);
  // importation des fonctions et états du contexte d'authentification
  const { checkAuthStatus, isLoggedIn } = useContext(AuthContext);
  const { filmsSelected, films, fetchFilms, filmsCount } =
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

  // pagination

  const filmsPerPage = filmsCount;
  const numberOfPages = Math.ceil(filmsPerPage / 20); // 20 films par page

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const renderPaginationButtons = () => {
    const paginationButtons = [];
    const firstPage = 1;
    const lastPage = numberOfPages;
    window.scrollTo({ top: 0, behavior: "smooth" });

    paginationButtons.push(
      <button
        key="back"
        onClick={() => handlePageChange(page - 1)}
        className="bg-red text-white p-2 m-2 rounded-md"
      >
        &lt;
      </button>
    );
    paginationButtons.push(
      <button
        key="first"
        onClick={() => handlePageChange(firstPage)}
        className=" text-white p-2 m-2 rounded-md"
      >
        1
      </button>
    );
    paginationButtons.push(
      <button
        key="second"
        onClick={() => handlePageChange(firstPage + 1)}
        className=" text-white p-2 m-2 "
      >
        2
      </button>
    );

    paginationButtons.push(
      <p key={page} className=" text-red p-2 m-2">
        {page}
      </p>
    );

    paginationButtons.push(
      <button
        key="last - 1"
        onClick={() => handlePageChange(lastPage - 1)}
        className=" text-white p-2 m-2 "
      >
        {lastPage - 1}
      </button>
    );
    paginationButtons.push(
      <button
        key="last"
        onClick={() => handlePageChange(lastPage)}
        className=" text-white p-2 m-2"
      >
        {lastPage}
      </button>
    );
    paginationButtons.push(
      <button
        key="next"
        onClick={() => handlePageChange(page + 1)}
        className="bg-red text-white p-2 m-2 "
      >
        &gt;
      </button>
    );
    return paginationButtons;
  };

  return (
    <div className="px-20 py-2">
      <main className="min-h-80">
        {/* Affichage du film recherché */}
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

        {/* Affichage de tous les films */}
        <h2 className="text-3xl font-bold border-b-2 border-red inline-block">
          Tous les films
        </h2>
        {
          <div className="grid grid-cols-5 gap-4">
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
        {/* pagination */}
        <div className="flex justify-center mt-4">
          {renderPaginationButtons()}
        </div>

        <div className="flex justify-center items-center"></div>
      </main>
    </div>
  );
};

export default Home;
