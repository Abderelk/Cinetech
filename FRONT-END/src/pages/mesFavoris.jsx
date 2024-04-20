import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext'
import { useEffect, useContext } from "react";
import axios from "axios";
import { URL } from "../../constant/api";
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


    return (
        <div className='px-20 py-2'>
            {/* messaged de bienvenue */}
            {user && user !== "" && <h1 className='text-red text-2xl'>Bienvenue {user}</h1>}
            {/* header */}
            <header className='flex justify-between items-center mb-10'>
                <div className='flex items-center'>
                    <h1 className='text-red px-3 py-2 text-2xl'>Cineteck</h1>
                    {isLoggedIn && (
                        <nav className='flex items-center'>
                            <ul className='flex flex-row'>
                                <li className='inline-block px-3 py-2 text-sm'>
                                    <Link className='hover:border-b-2 border-red' to="/">Accueil</Link>
                                </li>
                                <li className='inline-block px-3 py-2 text-sm'>
                                    <Link className='hover:border-b-2 border-red' to="/mes-favoris">Mes favoris</Link>
                                </li>
                                <li className='inline-block px-3 py-2 text-sm'>
                                    <Link className='hover:border-b-2 border-red' to="/deja-vues">Déjà vues</Link>
                                </li>
                                <li className='inline-block px-3 py-2 text-sm'>
                                    <Link className='hover:border-b-2 border-red' to="/a-voir">À voir</Link>
                                </li>
                            </ul>
                        </nav>
                    )}
                </div>

                <div className='flex items-center'>


                    {!isLoggedIn ? (
                        <button className='bg-red rounded-md px-3 py-2 text-white'>
                            <Link to="/login" >se connecter</Link>
                        </button>
                    ) : (
                        <button className='bg-red rounded-md px-3 py-2 text-white' onClick={logout}>Se déconnecter</button>
                    )}

                </div>
            </header>
            <main>
                <h2 className="text-3xl font-bold border-b-2 border-red inline-block">Mes films favoris</h2>
                {
                    favoris.length > 0 ? (
                        <div className='grid grid-cols-3 gap-4'>
                            {favoris.map((item, index) => (
                                <div className='bg-gray rounded-md p-5 m-3' key={index}>
                                    <button onClick={(event) => { handleRemoveFilm(event, item._id) }}>delete</button>
                                    <p>{item._id}</p>
                                    <p>{item.title}</p>
                                    <p>{item.originalTitle}</p>
                                    <p>{item.director}</p>
                                    <p>{item.year}</p>
                                    <p>{item.nationality}</p>
                                    <p>{item.duration}</p>
                                    <p>{item.genre}</p>
                                    <p>{item.synopsis}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Vous n'avez pas de films favoris</p>
                    )
                }

            </main >
        </div >
    );
}
export default MesFavoris;