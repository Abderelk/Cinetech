import React, { useState } from "react";
import { AuthContext } from '../../../context/AuthContext'
import { useEffect, useContext } from "react";
import axios from "axios";
import { URL } from "../../../constant/api";
import { FaDeleteLeft } from "react-icons/fa6";
import Film from "../../components/film/film";
const MesFavoris = () => {

    const { logout, isLoggedIn, checkAuthStatus, user } = useContext(AuthContext);
    useEffect(() => {
        checkAuthStatus();
    }, []);
    const [favoris, setFavoris] = useState([]);
    console.log(favoris);

    useEffect(() => {
        const fetchFavoris = async () => {
            try {
                const { data, status } = await axios.get(URL.GET_FAVORIS);
                if (status === 200) {
                    setFavoris(data);
                } else {
                    console.log('error');
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchFavoris();
    }, []);

    const handleRemoveFilm = async (event, filmId) => {
        try {
            event.preventDefault();
            const { status } = await axios.post(URL.REMOVE_FAVORIS, { filmId });
            if (status === 200) {
                const { data, status } = await axios.get(URL.GET_FAVORIS);
                if (status === 200) {
                    setFavoris(data);
                } else {
                    console.log('error');
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    const [selectedFilm, setSelectedFilm] = useState(null);
    const handleToggleSynopsis = (filmId) => {
        setSelectedFilm(selectedFilm === filmId ? null : filmId);
    };

    return (
        <div className='px-20 py-2'>
            {/* messaged de bienvenue */}
            {user && user !== "" && <h1 className='text-red text-2xl'>Bienvenue {user}</h1>}
            {/* header */}
            <main>
                <h2 className="text-3xl font-bold border-b-2 border-red inline-block">Mes films favoris</h2>
                {
                    favoris.length > 0 ? (
                        <div className='grid grid-cols-3 gap-4'>
                            {favoris.map((oneFilm, index) => (
                                <div className='bg-gray rounded-md p-5 m-3 hover:scale-105' key={oneFilm._id}>
                                    <Film oneFilm={oneFilm} selectedFilm={selectedFilm} handleRemoveFilm={handleRemoveFilm} handleToggleSynopsis={handleToggleSynopsis} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-5">Vous n'avez pas de films favoris</p>
                    )
                }

            </main >
        </div >
    );
}
export default MesFavoris;