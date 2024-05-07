// login.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
const Inscription = () => {
  const [newUser, setNewUser] = useState([]);
  const { signIn } = useContext(AuthContext);
  const [response, setResponse] = useState("");

  const inscription = async (e) => {
    e.preventDefault();
    try {
      const data = await signIn(newUser);
      setResponse(data);
    } catch (error) {
      console.log("erreur lors de l'inscription", error);
    }
  };
  return (
    <div className="px-20 py-5">
      <div className="flex justify-center">
        <div className="inline-block p-10 bg-black bg-opacity-90 rounded-md">
          <h1 className="mb-5 text-2xl">Inscription</h1>
          <form onSubmit={inscription} className="mt-4 flex flex-col">
            <label htmlFor="email" className="mb-1 text-opacity-70 text-white">
              Email
            </label>
            <input
              type="email"
              placeholder="antoine@outlook.fr"
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              className="rounded-md pl-3 mb-5 py-2 focus:outline-none bg-opacity-0 bg-black border border-white"
            />
            <label
              htmlFor="username"
              className="mb-1 text-opacity-70 text-white"
            >
              Pseudo
            </label>
            <input
              placeholder="antoinelvh"
              type="text"
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              className="rounded-md pl-3 mb-5 py-2 focus:outline-none bg-opacity-0 bg-black border border-white"
            />
            <label
              htmlFor="password"
              className="mb-1 text-opacity-70 text-white"
            >
              Mot de passe
            </label>
            <input
              placeholder="********"
              type="password"
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              required
              className="rounded-md pl-3 mb-5 py-2 focus:outline-none bg-opacity-0 bg-black border border-white"
            />
            <div>
              <input type="checkbox" className="mr-3" required />
              <label htmlFor="">
                J'ai lu et j'accepte la politique de confidentialité
              </label>
            </div>

            <button
              type="submit"
              className="bg-red rounded-md px-3 py-3 text-white my-5"
            >
              Créer mon compte
            </button>
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

export default Inscription;
