
// login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Inscription = () => {

    return (
        <div>
            <h1>Inscription</h1>
            <form action="" method="post">
                <label htmlFor="">Username</label>
                <input type="text" />
                <label htmlFor="">email</label>
                <input type="text" />
                <label htmlFor="">password</label>
                <input type="text" />
                <label htmlFor="">city</label>
                <input type="text" />
            </form>
            <Link to="/">Login</Link>

        </div>
    );
};

export default Inscription;