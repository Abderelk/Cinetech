
// login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { URL } from '../../constant/api';
const Inscription = () => {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [city, setCity] = useState("")


    const navigate = useNavigate()
    const signIn = async (event) => {
        event.preventDefault()
        try {
            const { data, status } = await axios.post(URL.USER_SIGNUP, { email, username, password, city })
            if (status === 201) {
                console.log("inscription réussie", data)
                navigate('/login')
            } else {
                console.log('erreur lors de l\'inscription')
            }
        } catch (error) {
            console.log("erreur lors de l'inscription", error)
        }
    }
    return (
        <div>
            <h1>Inscription</h1>
            <form action="" method="post" onSubmit={signIn}>
                <label htmlFor="">Email</label>
                <input type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="">username</label>
                <input type="username"
                    name="username"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="">password</label>
                <input type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="">city</label>
                <input type="text"
                    name="city"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <button type='submit'>Valider</button>
            </form>
            <Link to="/login">Login</Link>

        </div>
    );
};

export default Inscription;