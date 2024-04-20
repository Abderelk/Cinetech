
// login.jsx
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
const Inscription = () => {
    const [newUser, setNewUser] = useState([])
    console.log(newUser)

    const { signIn } = useContext(AuthContext);

    const inscription = async (e) => {
        e.preventDefault()
        try {
            await signIn(newUser);
        } catch (error) {
            console.log("erreur lors de l'inscription", error)
        }
    }
    return (
        <div>
            <h1>Inscription</h1>
            <form action="" method="post" onSubmit={inscription}>
                <label htmlFor="">Email</label>
                <input type="email"
                    name="email"
                    id="email"
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
                <label htmlFor="">username</label>
                <input type="username"
                    name="username"
                    id="username"
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
                <label htmlFor="">password</label>
                <input type="password"
                    name="password"
                    id="password"
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
                <label htmlFor="">city</label>
                <input type="text"
                    name="city"
                    id="city"
                    onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
                />
                <button type='submit'>Valider</button>
            </form>
            <Link to="/login">Login</Link>

        </div>
    );
};

export default Inscription;