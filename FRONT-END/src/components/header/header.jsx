import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { FilmContext } from "../../../context/FilmContext";
import { FaHome, FaRegStar, FaRegEye, FaHourglassStart } from "react-icons/fa";

const Header = () => {
  const { searchFilmByTerm } = useContext(FilmContext);
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [term, setTerm] = useState("");
  const isHomePage = location.pathname === "/";

  const handleSubmit = async (event) => {
    event.preventDefault();
    searchFilmByTerm(term);
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-center mb-10 px-5 md:px-20 py-5">
      <h1 className="text-red text-3xl mb-2 md:mb-0">Cineteck</h1>
      {isLoggedIn && (
        <nav className="flex flex-wrap justify-center md:justify-start">
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
      <div className="flex items-center mt-4 md:mt-0">
        {isHomePage && (
          <form onSubmit={handleSubmit} className="flex items-center mr-2">
            <input
              type="search"
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
            <Link to="/login">Se connecter</Link>
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

const NavLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex text-center hover:border-b-2 border-red px-3 text-sm mb-2 md:mb-0 mr-4"
  >
    {icon}
    {label}
  </Link>
);

export default Header;
