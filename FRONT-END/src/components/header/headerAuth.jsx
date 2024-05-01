import React from "react";
import { Link } from "react-router-dom";

const HeaderAuth = () => {
  const isLoginPage = location.pathname == "/login";

  return (
    <header className="flex justify-between oneFilms-center mb-10 px-20 py-5">
      <div className="fixed inset-0 -z-50">
        <div className="bg-[url('/src/assets/fond.webp')] bg-cover bg-center h-screen opacity-55"></div>
      </div>
      <div className="flex items-center">
        <h1 className="text-red px-3  text-3xl">Cineteck</h1>
      </div>
      <div></div>

      <div className="flex oneFilms-center">
        <button className="bg-red rounded-md px-3 py-2 mr-5 text-white">
          <Link to="/">Accueil</Link>
        </button>
        {!isLoginPage ? (
          <button className="bg-red rounded-md px-3 py-2 text-white">
            <Link to="/login">Se connecter</Link>
          </button>
        ) : (
          <button className="bg-red rounded-md px-3 py-2 text-white">
            <Link to="/inscription">S'inscrire </Link>
          </button>
        )}
      </div>
    </header>
  );
};
export default HeaderAuth;
