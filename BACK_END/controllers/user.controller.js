// On importe le model User
import userModel from "../models/user.model.js";
//on importe bycrypt pour décryper les token 
import bcrypt from "bcrypt";
// on importe jwt pour nos tokens 
import jwt from "jsonwebtoken";
// on importe env que l'on utilise pour la valeur de notre token
import { env } from "../config/index.js";


// fonctions pour s'inscrire
export const signUp = async (req, res) => {
    try {
        // on hash le mdp que l'utilisateur entre avec bcrypt
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        // on crée un nouvel utilisateur et on le met dans la dbb en mettant le mot de passe hashe
        const newUser = await userModel.create({
            ...req.body,
            password: hashedPassword
        });
        // on r'envoie une réponse pour informer que l'utilisateur a bien été crée
        res.status(201).json({ message: "User created successfully!", newUser });
    } catch (error) {
        console.log(error);
    }
}

// fonctions pour se connecter
export const login = async (req, res) => {
    try {
        // on cherhe l'adresse mail dans la dbb User
        const user = await userModel.findOne({ email: req.body.email });
        //  si l'user n'est pas trouvé, on r'envoie une erreur 404 ainsir qu'un message 
        if (!user) return res.status(404).json("Utilisateur introuvable");
        // compare le mot de passe fourni dans la requete
        const comparePassword = await bcrypt.compare(req.body.password, user.password);
        // si les messages ne correspondent pas on renvoie mauvais mdp
        if (!comparePassword) return res.status(400).json("Mauvais mot de passe");
        // création du token
        const token = jwt.sign(
            { username: user.username },
            env.token,
        )

        const { password, ...Utilisateur } = user._doc
        // on renvoie en reponse  un cookies  avec le token crée précédemment (il expire en une heure)
        res.cookie('token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 }).status(200).json(Utilisateur)
    } catch (error) {
        console.log(error);
    }
}



// fonctions pour vérifier que l'utilisateur est vien connecté
export const checkAuth = async (req, res) => {
    try {
        // On vérifie si le header de la requête contient des cookies
        if (req.headers.cookie) {
            // on recupere le token en découpant le cookie en deux morceaux séparé par le "="
            const token = req.headers.cookie.split('=')[1];
            // on decode le token à l'aide de notre clé présente dans env.token
            const decodedToken = jwt.verify(token, env.token);
            console.log(decodedToken)
            // on recupere la date d'expiration du token 
            const expDate = new Date(decodedToken.exp * 1000);
            console.log(expDate)
            // on stock la date actuel dans une const 
            const now = new Date();
            console.log(now)
            // si la date d'expiré est passé on passe isLoggedIn a false sinon on renvoie isLoggedIn a true
            if (expDate < now) {
                return res.json({ isLoggedIn: false });
            } else {
                return res.status(200).json({ isLoggedIn: true });
            }
        }
        // Si aucun cookie n'est présent, renvoye isLoggedIn a false
        return res.json({ isLoggedIn: false });
    } catch (error) {
        console.log(error);
        // En cas d'erreur, renvoyer un statut 500 (Internal Server Error)
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// fonctions pour se déconnecter
export const logout = async (req, res) => {
    // on va supprimer le cookie "token" et r'envoyer un message de déconnexion réussie
    try {
        res.clearCookie('token')
        console.log(req.headers.cookie)
        res.status(200).json({ message: 'Déconnexion réussie' });
    } catch (error) {
        console.log(error);
    }
}
