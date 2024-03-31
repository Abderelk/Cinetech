// home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataSuccess, fetchDataFailure } from '../../redux/user.reducer';
import { URL } from '../../constant/api';
import axios from 'axios';

const Home = () => {
    const dispatch = useDispatch();
    const store = useSelector(state => state.auth.data);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data, status } = await axios.get(URL.USER_GET);
                if (status === 201) {
                    dispatch(fetchDataSuccess(data));
                    console.log(store)
                } else {
                    dispatch(fetchDataFailure());
                    console.log('error');
                }
            } catch (error) {
                console.log(error);
                dispatch(fetchDataFailure());
            }
        }
        fetchUsers();
    }, [dispatch]);
    useEffect(() => {
        console.log('store changed:', store);
    }, [store]); // Surveiller les changements de store

    return (
        <div>

            {store ? store.map((item, index) => (
                <div className='users' key={index}>
                    <p>Username : {item.username}</p>
                    <p>Email : {item.email}</p>
                </div>

            ))
                : null
            }

        </div>
    );
};

export default Home;