import React from "react";
import {
  FaRegStar,
  FaRegEye,
  FaHourglassStart,
  FaDeleteLeft,
} from "react-icons/fa6";

const Film = ({
  oneFilm,
  handleAddFavoris,
  handleAddAVoir,
  handleAddVues,
  handleRemoveFilm,
  handleToggleSynopsis,
  selectedFilm,
  isLoggedIn,
}) => {
  const calculateRating = (rating) => {
    return Math.round((rating * 100) / 10);
  };
  const styleRating = (rating) => {
    if (rating < 4) {
      return "border-red ";
    } else if (rating < 7) {
      return "border-yellow";
    } else {
      return "border-green";
    }
  };
  return (
    <div
      key={oneFilm._id}
      className={oneFilm._id == selectedFilm ? "w-full" : "w-64"}
    >
      {isLoggedIn && handleAddVues && (
        <div className="flex justify-end space-x-2  mb-2">
          <button
            onClick={(event) => handleAddFavoris(event, oneFilm._id)}
            className="text-xl hover:bg-red hover:bg-opacity-50 hover:rounded-md p-2"
          >
            <FaRegStar />
          </button>
          <button
            onClick={(event) => handleAddVues(event, oneFilm._id)}
            className="text-xl hover:bg-red hover:bg-opacity-50 hover:rounded-md p-2"
          >
            <FaRegEye />
          </button>
          <button
            onClick={(event) => handleAddAVoir(event, oneFilm._id)}
            className="text-xl hover:bg-red hover:bg-opacity-50 hover:rounded-md p-2"
          >
            <FaHourglassStart />
          </button>
        </div>
      )}
      {handleRemoveFilm && (
        <div className="flex justify-end space-x-4">
          <button
            onClick={(event) => handleRemoveFilm(event, oneFilm._id)}
            className="text-xl hover:bg-red hover:bg-opacity-50 hover:rounded-md p-2"
          >
            <FaDeleteLeft />
          </button>
        </div>
      )}
      <div className={selectedFilm === oneFilm._id ? "flex" : ""}>
        {oneFilm.posterUrl != null ? (
          <img
            onClick={() => handleToggleSynopsis(oneFilm._id)}
            src={`https://image.tmdb.org/t/p/w500/${oneFilm.posterUrl}`}
            alt={oneFilm.title}
            loading="lazy"
            className="object-cover cursor-pointer h-96"
          />
        ) : (
          <img
            onClick={() => handleToggleSynopsis(oneFilm._id)}
            src="src/assets/posterFilm.webp"
            alt={oneFilm.title}
            loading="lazy"
            className="object-cover h-96 cursor-pointer"
          />
        )}
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <h2
              className={
                selectedFilm === oneFilm._id ? "text-3xl mx-4" : "text-xl"
              }
            >
              {oneFilm.title}
            </h2>
            {oneFilm.voteAverage && (
              <p
                className={`min-w-12 h-12 flex items-center justify-center rounded-md border-2 mt-2 ${styleRating(
                  oneFilm.voteAverage
                )} `}
              >
                {calculateRating(oneFilm.voteAverage)}%
              </p>
            )}
          </div>
          {selectedFilm === oneFilm._id && (
            <div className="my-4 p-4 ">
              <p className="text-lg font-semibold  mb-6">
                Titre Originel : {oneFilm.originalTitle}
              </p>
              <p>
                <span className="font-semibold">Réalisateurs :</span>{" "}
                {oneFilm.director}
              </p>
              <p>
                <span className="font-semibold">Année de production :</span>{" "}
                {oneFilm.year}
              </p>
              <p>
                <span className="font-semibold">Nationalité :</span>{" "}
                {oneFilm.nationality}
              </p>
              <p>
                <span className="font-semibold">Durée :</span>{" "}
                {oneFilm.duration}
              </p>
              <p>
                <span className="font-semibold">Genre :</span> {oneFilm.genre}
              </p>
              <p className="my-6">
                <span className="font-semibold">Synopsis :</span>{" "}
                {oneFilm.synopsis}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Film;
