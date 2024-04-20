import React from "react";
import { FaRegStar, FaRegEye, FaHourglassStart, FaDeleteLeft } from "react-icons/fa6";

const Film = ({ oneFilm, handleAddFavoris, handleAddAVoir, handleAddVues, handleRemoveFilm, handleToggleSynopsis, selectedFilm, isLoggedIn }) => {
    return (
        <div className='bg-gray rounded-md  hover:scale-104' key={oneFilm._id}>
            {isLoggedIn && handleAddVues &&
                <div className="flex justify-end space-x-4">
                    <button onClick={(event) => handleAddFavoris(event, oneFilm._id)} className="text-2xl hover:bg-black hover:bg-opacity-50 hover:rounded-md p-2">
                        <FaRegStar />
                    </button>
                    <button onClick={(event) => handleAddVues(event, oneFilm._id)} className="text-2xl hover:bg-black hover:bg-opacity-50 hover:rounded-md p-2">
                        <FaRegEye />
                    </button>
                    <button onClick={(event) => handleAddAVoir(event, oneFilm._id)} className="text-2xl hover:bg-black hover:bg-opacity-50 hover:rounded-md p-2">
                        <FaHourglassStart />
                    </button>
                </div>
            }
            {handleRemoveFilm && (
                <div className="flex justify-end space-x-4">
                    <button onClick={(event) => handleRemoveFilm(event, oneFilm._id)} className="text-2xl hover:bg-black hover:bg-opacity-50 hover:rounded-md p-2">
                        <FaDeleteLeft />
                    </button>
                </div>
            )}
            <h2 className='text-xl'>{oneFilm.title}</h2>

            <p onClick={() => handleToggleSynopsis(oneFilm._id)} className="cursor-pointer my-3 underline">Détails</p>
            {selectedFilm === oneFilm._id && (
                <>
                    <p>{oneFilm.synopsis}</p>
                    <p>{oneFilm.originalTitle}</p>
                    <p>{oneFilm.director}</p>
                    <p>{oneFilm.year}</p>
                    <p>{oneFilm.nationality}</p>
                    <p>{oneFilm.duration}</p>
                    <p>{oneFilm.genre}</p>
                </>
            )}
        </div>
    )
};
export default Film;