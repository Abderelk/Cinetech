import React, { useState, useEffect, useContext } from 'react';
// lien des pages et requêtes API
import { URL } from '../../constant/api';
import { Link } from 'react-router-dom';
import axios from 'axios';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataSuccess, fetchDataFailure } from '../../redux/film.reducer';
// contexte d'authentification
import { AuthContext } from '../../context/AuthContext';
// contexte utilisateur
import { UserContext } from '../../context/UserContext';
// chargement de pages
import LoadingSpinner from '../components/loadingSpinner';
// pagination
import ReactPaginate from 'react-paginate';
// footer
import footer from '../components/footer';


const Film = () => {
    // importation des fonctions et états du contexte d'authentification
    const { logout, isLoggedIn, checkAuthStatus, user } = useContext(AuthContext);
    // importation des fonctions et états du contexte utilisateur
    const { addFavoris, addAVoir, addVues } = useContext(UserContext);
    // redux
    const dispatch = useDispatch();
    const store = useSelector(state => state.film.data);
    // id pour la recherche de film par id
    const [Id, setId] = useState("");
    // pagination
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 9;
    // fonctions pour afficher les films sur la page

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
    // fonctions pour afficher les films sur la page
    const handleSubmit = async (event) => {
        event.preventDefault();
        setId(event.target.setId.value);
    };
    const oneFilm = store[Id - 1];

    // fonctions pour afficher les films de chaque page (pagination)
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };
    // calculs des films à afficher par page
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = store.slice(startIndex, endIndex);
    //

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const handleAddFavoris = async (event, item) => {
        event.preventDefault();
        try {
            addFavoris(item);
            console.log(item, user)
        } catch (error) {
            console.log(error)
        }
    }
    const handleAddAVoir = async (event, item) => {
        event.preventDefault();
        try {
            addAVoir(item);
            console.log(item, user)
        } catch (error) {
            console.log(error)
        }
    }
    const handleAddVues = async (event, item) => {
        event.preventDefault();
        try {
            addVues(item);
            console.log(item, user)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='px-20 py-2' >
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
                    <form action="" method="get" onSubmit={handleSubmit} className="flex items-center mr-2">
                        <input type="text" name="setId" id="setId" placeholder='Rechercher un film...' className='rounded-l-md pl-3 py-2 focus:outline-none bg-black border border-r-0 border-white' />
                        <button type="submit" className='rounded-r-md px-3 py-2 border border-white border-l-0 bg-transparent'>
                            <svg className="h-6 w-6 text-red-600" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <circle cx="10" cy="10" r="7" />
                                <line x1="21" y1="21" x2="15" y2="15" />
                            </svg>
                        </button>
                    </form>

                    {!isLoggedIn ? (
                        <button className='bg-red rounded-md px-3 py-2 text-white'>
                            <Link to="/login" >se connecter</Link>
                        </button>
                    ) : (
                        <button className='bg-red rounded-md px-3 py-2 text-white' onClick={logout}>Se déconnecter</button>
                    )}

                </div>
            </header>
            {/* main */}
            <main>
                {
                    oneFilm && oneFilm._id &&
                    <div className='bg-gray rounded-md p-5 m-3' key={oneFilm._id}>
                        <p >{oneFilm._id}</p>
                        <p>{oneFilm.title}</p>
                        <p>{oneFilm.originalTitle}</p>
                        <p>{oneFilm.director}</p>
                        <p>{oneFilm.year}</p>
                        <p>{oneFilm.nationality}</p>
                        <p>{oneFilm.genre}</p>
                        <p>{oneFilm.synopsis}</p>
                    </div>
                }

                {/* Display current page items */}
                <h2 className="text-3xl font-bold border-b-2 border-red inline-block">Tous les films</h2>
                {
                    currentItems && currentItems.length > 0 ?
                        (
                            <div className='grid grid-cols-3 gap-4'>

                                {currentItems.map((item, index) => (

                                    <div className='bg-gray rounded-md p-5 m-3' key={index}>
                                        {/*  bouton pour ajouter aux favoris */}
                                        <button onClick={(event) => handleAddFavoris(event, item._id)}>Favoris</button>
                                        <button onClick={(event) => handleAddVues(event, item._id)}>Vues</button>
                                        <button onClick={(event) => handleAddAVoir(event, item._id)}>A Voir</button>

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
                        ) :
                        <LoadingSpinner />
                }

                {/* Pagination */}

                <ReactPaginate
                    nextLabel=" >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={2}
                    pageCount={Math.ceil(store.length / itemsPerPage)}
                    previousLabel="< "
                    renderOnZeroPageCount={null}
                    className='flex justify-between items-center mt-5 mx-auto w-1/2'
                />

            </main >
            {footer()}
        </div >
    );
};

export default Film;
