// home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataSuccess, fetchDataFailure } from '../../redux/film.reducer';
import { URL } from '../../constant/api';
import axios from 'axios';
import LoadingSpinner from '../components/loadingSpinner';

const Film = () => {
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
        }
        fetchFilms();
    }, [dispatch]);


    return (
        <div>
            {store && store.length > 0 &&
                <Link to="/film"> séléctionner un film</Link>}

            {store && store.length > 0 ? store.map((item, index) => (
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
                < LoadingSpinner />
            }


        </div>
    );
};

export default Film;