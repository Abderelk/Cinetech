
// login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
const Login = () => {

    return (
        <div>
            <h1>Login</h1>
            <form action="" method="post">
                <label htmlFor="">Username</label>
                <input type="text" />
                <label htmlFor="">password</label>
                <input type="text" />
            </form>
            <Link to="/inscription">Inscription</Link>
        </div>
    );
};

export default Login;