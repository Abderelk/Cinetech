import React, { useState, useEffect, useContext } from 'react';
// lien des pages et requêtes API
import { URL } from '../../../constant/api.js';
import axios from 'axios';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataSuccess, fetchDataFailure } from '../../../redux/film.reducer.js';
// contexte d'authentification
import { AuthContext } from '../../../context/AuthContext.jsx';
// contexte utilisateur
import { UserContext } from '../../../context/UserContext.jsx';
// chargement de pages
import LoadingSpinner from '../../components/loading/loadingSpinner.jsx';
// film
import Film from '../../components/film/film.jsx';
// icones

const Home = () => {
    // importation des fonctions et états du contexte d'authentification
    const { checkAuthStatus, isLoggedIn } = useContext(AuthContext);
    // importation des fonctions et états du contexte utilisateur
    const { addFavoris, addAVoir, addVues } = useContext(UserContext);
    // redux
    const dispatch = useDispatch();
    const store = useSelector(state => state.film.data);

    useEffect(() => {
        const fetchFilms = async () => {
            try {
                const { data, status } = await axios.get(URL.FILM_GET);
                if (status === 200) {
                    dispatch(fetchDataSuccess(data));
                } else {
                    dispatch(fetchDataFailure());
                    console.log('error');
                }
            } catch (error) {
                console.log(error);
                dispatch(fetchDataFailure());
                console.log('error');
            }
        };
        fetchFilms();
    }, [dispatch]);
    // id pour la recherche de film par id
    const [Id, setId] = useState("");
    // fonctions pour afficher un film recherché sur la page
    const handleSubmit = async (event) => {
        event.preventDefault();
        setId(event.target.setId.value);
    };
    const oneFilm = store[Id - 1];


    useEffect(() => {
        checkAuthStatus();
    }, []);

    const handleAddFavoris = async (event, oneFilm) => {
        event.preventDefault();
        try {
            addFavoris(oneFilm);
        } catch (error) {
            console.log(error)
        }
    }
    const handleAddAVoir = async (event, oneFilm) => {
        event.preventDefault();
        try {
            addAVoir(oneFilm);
        } catch (error) {
            console.log(error)
        }
    }
    const handleAddVues = async (event, oneFilm) => {
        event.preventDefault();
        try {
            addVues(oneFilm);
        } catch (error) {
            console.log(error)
        }
    }

    const [selectedFilm, setSelectedFilm] = useState(null);
    const handleToggleSynopsis = (filmId) => {
        setSelectedFilm(selectedFilm === filmId ? null : filmId);
    };

    return (
        <div className='px-20 py-2' >
            < main className='min-h-80'>
                {/* Affichage du film recherché */}
                {
                    oneFilm && oneFilm._id &&
                    <div className='bg-gray rounded-md p-5 m-3 hover:scale-105' key={oneFilm._id}>
                        <Film oneFilm={oneFilm} selectedFilm={selectedFilm} handleAddAVoir={handleAddAVoir} handleAddFavoris={handleAddFavoris} handleAddVues={handleAddVues} handleToggleSynopsis={handleToggleSynopsis} />
                    </div>
                }

                {/* Affichage de tous les films */}
                <h2 className="text-3xl font-bold border-b-2 border-red inline-block">Tous les films</h2>
                {
                    <div className='grid grid-cols-3 gap-4'>
                        {store.length === 0 && <LoadingSpinner />}
                        {store.map((oneFilm, index) => (
                            <div className='bg-gray rounded-md p-5 m-3 hover:scale-105' key={oneFilm._id}>
                                <Film oneFilm={oneFilm} selectedFilm={selectedFilm} handleAddAVoir={handleAddAVoir} handleAddFavoris={handleAddFavoris} handleAddVues={handleAddVues} handleToggleSynopsis={handleToggleSynopsis} isLoggedIn={isLoggedIn} />
                            </div>
                        ))}
                    </div>
                }
            </main >
        </div>
    );
};

export default Home;
