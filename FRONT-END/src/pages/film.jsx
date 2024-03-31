// home.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataFailure, fetchDataSuccess } from '../../redux/film.reducer';
import { URL } from '../../constant/api';
import axios from 'axios';

const Film = () => {
    const dispatch = useDispatch();
    const oneFilm = useSelector(state => state.film.data);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const Id = event.target.setId.value;
        console.log(Id);
        try {
            const { data, status } = await axios.get(`${URL.FILM_GET_BY_ID}${Id}`);
            if (status === 200) {
                dispatch(fetchDataSuccess(data));
            }
            else {
                console.log('error');
                dispatch(fetchDataFailure());
            }
        } catch (error) {
            console.log(error)
            dispatch(fetchDataFailure());
        }
    }

    return (
        <div>
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
            <Link to="/films">Page avec les films</Link>
        </div >
    )
}

export default Film;