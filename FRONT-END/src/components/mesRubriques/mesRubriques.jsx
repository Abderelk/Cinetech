import React, { useState, useEffect, useContext } from "react";
import Film from "../../components/film/film";
import { UserContext } from "../../context/UserContext";
import Notification from "../notification/notification";
import EmptyFilm from "../../components/film/emptyFilm.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";

const MesRubriques = ({ title, rubrique }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { removeFilmFromRubrique, getFilmsRubrique } = useContext(UserContext);
  const { checkAuthStatus } = useContext(AuthContext);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationContent, setNotificationContent] = useState("");
  useEffect(() => {
    const getFilm = async () => {
      const data = await getFilmsRubrique(rubrique);
      setData(data);
      setLoading(false);
    };
    getFilm();
  }, [rubrique]);

  const handleRemoveFilm = async (e, oneFilm) => {
    e.preventDefault();
    try {
      const updatedData = await removeFilmFromRubrique(oneFilm, rubrique);
      setData(updatedData);
      setNotificationContent("Film retiré de la rubrique");
      setNotificationOpen(true);
      setTimeout(() => {
        setNotificationOpen(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };
  const closeNotification = () => {
    setNotificationOpen(false);
  };
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const [selectedFilm, setSelectedFilm] = useState(null);
  const handleToggleSynopsis = (filmId) => {
    setSelectedFilm(selectedFilm === filmId ? null : filmId);
  };
  return (
    <div className="px-14 py-2 min-h-screen">
      <main>
        <Notification
          isOpen={notificationOpen}
          content={notificationContent}
          closeNotification={closeNotification}
        />
        <h2 className="text-3xl font-bold border-b-2 border-red inline-block my-5">
          {title}
        </h2>
        <div className="flex flex-wrap justify-center">
          {loading &&
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray bg-opacity-5 rounded-md p-5 m-3 hover:scale-105 "
              >
                <EmptyFilm index={index} />
              </div>
            ))}
        </div>
        {!loading ? (
          data.length > 0 ? (
            <div className="flex flex-wrap justify-center">
              {data.map((oneFilm) => (
                <div
                  className={
                    selectedFilm == oneFilm._id
                      ? "bg-gray bg-opacity-5 rounded-md p-5 m-3 w-full"
                      : "bg-gray bg-opacity-5 rounded-md p-5 m-3 hover:scale-105"
                  }
                  key={oneFilm._id}
                >
                  <Film
                    oneFilm={oneFilm}
                    selectedFilm={selectedFilm}
                    handleRemoveFilm={handleRemoveFilm}
                    handleToggleSynopsis={handleToggleSynopsis}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-5">Vous n'avez pas de films dans cette rubrique</p>
          )
        ) : null}
      </main>
    </div>
  );
};

export default MesRubriques;
