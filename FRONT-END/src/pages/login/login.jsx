// login.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [user, setUser] = useState([]);
  const [response, setResponse] = useState("");

  const connexion = async (e) => {
    e.preventDefault();
    try {
      const data = await login(user);
      setResponse(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="px-20 py-5 min-h-screen flex justify-center items-center">
      <div className="flex justify-center">
        <div className="inline-block p-10 bg-black bg-opacity-90 rounded-md ">
          <h1 className="mb-5 text-2xl">S'identifier</h1>
          <form onSubmit={connexion} className="mt-4 flex flex-col">
            <label htmlFor="email" className="mb-1 text-opacity-70 text-white ">
              Email
            </label>
            <input
              type="email"
              placeholder="antoine@gmail.com"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="rounded-md pl-3 mb-5 py-2 focus:outline-none bg-opacity-0 bg-black border border-white"
            />
            <label
              htmlFor="password"
              className="mb-1 text-opacity-70 text-white "
            >
              password
            </label>
            <input
              type="password"
              placeholder="Mot de passe"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
              className="rounded-md pl-3 py-2 mb-2 focus:outline-none bg-opacity-0 bg-black border border-white"
            />
            <div className="password-error mt-2"></div>
            <button
              type="submit"
              className="bg-red rounded-md px-3 py-3 text-white my-5"
            >
              Connexion
            </button>
            <p className="text-white text-opacity-70">
              <a href="/inscription" className="underline">
                Vous n'avez pas de compte ? Inscrivez-vous
              </a>
            </p>
            {response && (
              <p className="text-red text-center mt-2 mb-0 font-bold text-xl">
                {response}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
