import React from "react";
import { useState } from "react";
const Footer = () => {
  const [showLegal, setShowLegal] = useState(false);

  const toggleLegal = () => {
    setShowLegal(!showLegal);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <footer>
      <div className="flex flex-row justify-between mt-10 mb-2 px-20 py-5 ">
        <p className="inline-block text-xs">©2024-Abderrahmane-ELKafif</p>
        <p
          className="inline-block text-xs cursor-pointer"
          onClick={toggleLegal}
        >
          mentions légales et politique de confidentialité
        </p>
      </div>

      {showLegal && (
        <div className="w-full bg-gray-200 p-4  rounded-md px-20 py-5">
          <h2 className="text-3xl font-semibold mb-4 text-center">
            Mentions légales
          </h2>
          <p className="mb-4">
            L'utilisation du site{" "}
            <a
              href="https://cinetech.abderrahmane-elkafif.com/"
              className="underline text-red"
            >
              https://cinetech.abderrahmane-elkafif.com/
            </a>{" "}
            implique l'acceptation des présentes mentions légales.
          </p>
          <h3 className="text-xl font-semibold my-4 mb-2 text-center">
            Collecte de données
          </h3>
          <p className="mb-4">
            Lors de l'inscription, le site collecte les informations suivantes :
          </p>
          <li>Adresse e-mail</li>
          <li>Nom d'utilisateur</li>
          <li>Mot de passe</li>
          <p className="my-4">
            Ces informations sont strictement utilisées dans le but de permettre
            à l'utilisateur d'accéder à son compte et ne sont en aucun cas
            utilisées à des fins commerciales.
          </p>
          <h3 className="text-xl font-semibold my-4 mb-2 text-center">
            Données de géolocalisation
          </h3>
          <p className="mb-4">
            Le site peut également recueillir la position de l'utilisateur, avec
            son consentement préalable, dans le but d'afficher les festivals de
            cinéma autour de lui.
          </p>
          <h3 className="text-xl font-semibold my-4 mb-2 text-center">
            Hébergement
          </h3>
          <p>
            L'hébergement du site est assuré par{" "}
            <a
              href="https://www.o2switch.fr/"
              className="underline text-gray-800"
            >
              o2switch
            </a>
            .
          </p>
        </div>
      )}
    </footer>
  );
};
export default Footer;
