import React, { useState } from "react";
import { AuthContext } from '../../../context/AuthContext'
import { useEffect, useContext } from "react";
import axios from "axios";
import { URL } from "../../../constant/api";
import { FaDeleteLeft } from "react-icons/fa6";

const MesaVoir = () => {

    const { logout, isLoggedIn, checkAuthStatus, user } = useContext(AuthContext);
    useEffect(() => {
        checkAuthStatus();
    }, []);
    const [dejavue, setDejaVue] = useState([]);

    useEffect(() => {
        const fetchdejavue = async () => {
            try {
                const { data, status } = await axios.get(URL.GET_VUES);
                if (status === 200) {
                    setDejaVue(data);
                } else {
                    console.log('error');
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchdejavue();
    }, []);

    const handleRemoveFilm = async (event, filmId) => {
        try {
            event.preventDefault();
            const { status } = await axios.post(URL.REMOVE_VUES, { filmId });
            if (status === 200) {
                const { data, status } = await axios.get(URL.GET_VUES);
                if (status === 200) {
                    setDejaVue(data);
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

            <main>
                <h2 className="text-3xl font-bold border-b-2 border-red inline-block">Mes films déjà vues</h2>
                {
                    dejavue.length > 0 ? (
                        <div className='grid grid-cols-3 gap-4'>
                            {dejavue.map((item, index) => (
                                <div className='bg-gray rounded-md p-5 m-3' key={index}>
                                    <div className="flex justify-end space-x-4">
                                        <button onClick={(event) => handleRemoveFilm(event, item._id)} className="text-2xl hover:bg-black hover:bg-opacity-50 hover:rounded-md p-2"><FaDeleteLeft /></button>
                                    </div>
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
                        <p className="mt-5">Vous n'avez pas de films favoris</p>

                    )
                }

            </main >
        </div >
    );
}
export default MesaVoir;