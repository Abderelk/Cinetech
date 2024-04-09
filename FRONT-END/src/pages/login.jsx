// login.jsx
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useEffect } from 'react';




const Login = () => {

    const { login, checkAuthStatus } = useContext(AuthContext);
    const [user, setUser] = useState([]);

    const connexion = async (e) => {
        e.preventDefault();
        try {
            await login(user);
        } catch (error) {
            console.error('Erreur lors de la connexion', error);
        }
    };


    useEffect(() => {
        checkAuthStatus();
    }, []);
    return (
        <div>
            <div>
                <Link to="/">Accueil</Link>
            </div>
            <Link to="/inscription">Inscription</Link>

            <h1>Login</h1>

            <form onSubmit={connexion}>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="email"
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    required
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="password"
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    required
                />
                <div className='password-error'></div>
                <button type="submit">Connexion</button>
            </form>
        </div >
    );
};

export default Login;
