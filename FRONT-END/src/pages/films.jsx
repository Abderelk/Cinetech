import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataSuccess, fetchDataFailure } from '../../redux/film.reducer';
import { URL } from '../../constant/api';
import axios from 'axios';
import LoadingSpinner from '../components/loadingSpinner';
import ReactPaginate from 'react-paginate';

const Film = () => {
    const dispatch = useDispatch();
    const store = useSelector(state => state.film.data);
    const [Id, setId] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setId(event.target.setId.value);
    };

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    // Calculate pagination offsets
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Slice the store array based on current page
    const currentItems = store.slice(startIndex, endIndex);

    const oneFilm = store[Id - 1];

    return (
        <div>
            <Link to="/login">se connecter</Link>
            <form action="" method="get" onSubmit={handleSubmit}>
                <label htmlFor="setId"> Id du film </label>
                <input type="text" name="setId" id="setId" />
                <button type="submit">Rechercher</button>
            </form>

            {oneFilm && oneFilm._id &&
                <div className='films' key={oneFilm._id}>
                    <p>{oneFilm._id}</p>
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
            {currentItems && currentItems.length > 0 ? currentItems.map((item, index) => (
                <div className='films' key={index}>
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
            )) :
                <LoadingSpinner />
            }

            {/* Pagination */}
            <ReactPaginate
                breakLabel="..."
                nextLabel="suivant >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                pageCount={Math.ceil(store.length / itemsPerPage)}
                previousLabel="< précédent"
                renderOnZeroPageCount={null}
                className='pagination'
            />
        </div>
    );
};

export default Film;
