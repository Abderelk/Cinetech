import React from "react";
import { Link } from "react-router-dom";

const HeaderAuth = () => {
  const isLoginPage = location.pathname == "/login";

  return (
    <header className="sm:flex sm:justify-between justify-center align-middle text-center mb-10 sm:px-20 px-5 py-5">
      <div className="fixed inset-0 -z-50">
        <div className="bg-[url('/assets/fond.webp')] bg-cover bg-center h-screen opacity-55"></div>
      </div>
      <div className="flex justify-center sm:justify-start ">
        <h1 className="text-red px-3 text-3xl">Cineteck</h1>
      </div>

      <div className="flex justify-around my-5 sm:my-0">
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
