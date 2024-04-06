// user.controller.js
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt, { decode } from "jsonwebtoken";
import { env } from "../config/index.js";

export const login = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        //  si l'user n'est pas trouvé, renvoi une erreur 404.
        if (!user) return res.status(404).json("Utilisateur introuvable");
        // compare le mot de passe fourni dans la requete
        const comparePassword = await bcrypt.compare(req.body.password, user.password);
        if (!comparePassword) return res.status(400).json("Mauvais mot de passe");
        // création du token
        const token = jwt.sign(
            { username: user.username },
            env.token,
        )
        const { password, ...Utilisateur } = user._doc
        res.cookie('token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 }).status(200).json(Utilisateur)
    } catch (error) {
        console.log(error);
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token')
        console.log(req.headers.cookie)
        res.status(200).json({ message: 'Déconnexion réussie' });
    } catch (error) {
        console.log(error);
    }
}


export const signUp = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await userModel.create({
            ...req.body,
            password: hashedPassword
        });

        res.status(201).json({ message: "User created successfully!", newUser });
    } catch (error) {
        console.log(error);
    }
}

export const checkAuth = async (req, res) => {
    try {
        // Vérifier si des cookies sont présents dans les en-têtes de la requête
        if (req.headers.cookie) {
            const token = req.headers.cookie.split('=')[1];
            const decodedToken = jwt.verify(token, env.token);
            console.log(decodedToken)
            const expDate = new Date(decodedToken.exp * 1000);
            console.log(expDate)
            const now = new Date();
            console.log(now)
            if (expDate < now) {
                return res.status(401).json({ isLoggedIn: false });
            } else {
                return res.status(200).json({ isLoggedIn: true });
            }
        }
        // Si aucun cookie n'est présent, renvoyer un statut 401 (Unauthorized) pour indiquer que l'utilisateur n'est pas authentifié
        return res.status(401).json({ isLoggedIn: false });
    } catch (error) {
        console.log(error);
        // En cas d'erreur, renvoyer un statut 500 (Internal Server Error)
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

