import React, { useEffect, useState } from "react";
import MapComponent from "../../components/map/map.jsx";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext.jsx";
import { UserContext } from "../../../context/UserContext.jsx";

const ADeuxPas = () => {
  const { userLocation, checkAuthStatus } = useContext(AuthContext);
  const { festivals } = useContext(UserContext);
  const [selectedFestival, setSelectedFestival] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const showFestivalDetails = (festival) => {
    setSelectedFestival(selectedFestival == null ? festival : null);
  };
  console.log(festivals);
  return (
    <div className="px-14 py-2 min-h-screen">
      <h2 className="text-3xl font-bold border-b-2 border-red inline-block my-5">
        À deux pas de chez vous !
      </h2>
      <div className="h-96 overflow-hidden">
        <MapComponent
          className="h-fit"
          location={userLocation}
          festivals={festivals}
          selectedFestival={selectedFestival}
        />
      </div>
      <h2 className="text-3xl font-bold border-b-2 border-red inline-block my-5">
        Liste des festivals
      </h2>
      <div className="flex flex-wrap justify-center">
        {festivals.length === 0 && (
          <h1>
            Pas de festival à proximité de chez vous. Vous pouvez en ajouter
            dans vos favoris pour les retrouver plus facilement.
          </h1>
        )}

        {festivals.length > 0 &&
          festivals.map((festival, index) => {
            return (
              <div
                onClick={() => showFestivalDetails(index)}
                key={index}
                className={
                  index === selectedFestival
                    ? "bg-gray bg-opacity-5 rounded-md p-5 m-3  cursor-pointer w-5/6 flex justify-around "
                    : "bg-gray bg-opacity-5 rounded-md p-5 m-3 hover:scale-105 cursor-pointer w-1/6"
                }
              >
                <h2
                  className={
                    index === selectedFestival
                      ? "text-3xl  underline decoration-red-800"
                      : "text-xl underline decoration-red-800"
                  }
                >
                  {festival.nom_du_festival}
                </h2>
                {selectedFestival == index && (
                  <div>
                    <p>
                      <span className="font-bold">Adresse mail : </span>
                      <a
                        href={`mailto:${festival.adresse_e_mail}`}
                        className="underline"
                      >
                        {festival.adresse_e_mail}
                      </a>
                    </p>
                    <p>
                      <span className="font-bold">Année de production :</span>
                      {festival.annee_de_creation_du_festival}
                    </p>
                    <p>
                      <span className="font-bold">Site du festival : </span>
                      {festival.site_internet_du_festival}
                    </p>
                    <p>
                      <span className="font-bold">Lieu : </span>
                      {festival.libelle_epci_collage_en_valeur}
                    </p>
                    <p>
                      <span className="font-bold">Période et durée : </span>
                      {festival.periode_principale_de_deroulement_du_festival}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ADeuxPas;
