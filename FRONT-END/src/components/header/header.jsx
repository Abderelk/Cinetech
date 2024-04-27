import React from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useContext } from "react";
import { FaHome } from "react-icons/fa";
import { FaRegStar, FaRegEye, FaHourglassStart } from "react-icons/fa6";
import { useState } from "react";
import { FilmContext } from "../../../context/FilmContext";

const Header = () => {
  const { searchFilmByTerm } = useContext(FilmContext);

  const { isLoggedIn, logout } = useContext(AuthContext);
  const isHomePage = location.pathname === "/";
  const [term, setTerm] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    searchFilmByTerm(term);
  };
  console.log(term);
  return (
    <header className="flex justify-between oneFilms-center mb-10 px-20 py-5">
      <div className="flex items-center">
        <h1 className="text-red px-3  text-2xl">Cineteck</h1>

        {isLoggedIn && (
          <nav>
            <ul className="flex flex-row items-center">
              <li className="px-3 text-sm">
                <Link
                  className="flex text-center hover:border-b-2 border-red "
                  to="/"
                >
                  <FaHome className="text-xl mr-2" />
                  Accueil
                </Link>
              </li>
              <li className=" px-3  text-sm">
                <Link
                  className="flex text-center  hover:border-b-2 border-red"
                  to="/mes-favoris"
                >
                  {" "}
                  <FaRegStar className="text-xl mr-2" />
                  Mes favoris
                </Link>
              </li>
              <li className="px-3 text-sm">
                <Link
                  className=" flex text-center hover:border-b-2 border-red"
                  to="/deja-vues"
                >
                  <FaRegEye className="text-xl mr-2" />
                  Déjà vues
                </Link>
              </li>
              <li className="px-3 text-sm">
                <Link
                  className=" flex text-center hover:border-b-2 border-red "
                  to="/a-voir"
                >
                  <FaHourglassStart className="text-xl mr-2" />À voir
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>

      <div className="flex oneFilms-center">
        {isHomePage && (
          <form onSubmit={handleSubmit} className="flex oneFilms-center mr-2">
            <input
              type="text"
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Rechercher un film..."
              className="rounded-l-md pl-3 py-2 focus:outline-none bg-black border border-r-0 border-white"
            />
            <button
              type="submit"
              className="rounded-r-md px-3 py-2 border border-white border-l-0 bg-transparent"
            >
              <svg
                className="h-6 w-6 text-red-600"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <circle cx="10" cy="10" r="7" />
                <line x1="21" y1="21" x2="15" y2="15" />
              </svg>
            </button>
          </form>
        )}

        {!isLoggedIn ? (
          <button className="bg-red rounded-md px-3 py-2 text-white">
            <Link to="/login">se connecter</Link>
          </button>
        ) : (
          <button
            className="bg-red rounded-md px-3 py-2 text-white"
            onClick={logout}
          >
            Se déconnecter
          </button>
        )}
      </div>
    </header>
  );
};
export default Header;
