// On importe le model User
import userModel from "../models/user.js";
import filmModel from "../models/film.js";
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
            const username = decodedToken.username;
            console.log(username)
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
                return res.status(200).json({ isLoggedIn: true, username: username });
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


// fonctions pour ajouter un film à la rubrique favoris
export const addFavoris = async (req, res) => {
    try {
        if (req.headers.cookie) {
            const token = jwt.verify(req.headers.cookie.split('=')[1], env.token);
            const username = token.username;
            const filmId = req.body.filmId;
            console.log(username)
            console.log(req.body.filmId)
            if (username) {
                const user = await userModel.findOne({ username: username })
                if (user.favoris.includes(filmId)) {
                    res.status(400).json("Film déjà dans les favoris")
                }
                else {
                    await userModel.findOneAndUpdate({ username: username }, { $push: { favoris: filmId } })
                    res.status(201).json("Film ajouté")
                }
            }
            else {
                res.status(404).json("Utilisateur introuvable")
            }
        }

    }
    catch (error) {
        console.log(error)
    }
}
// fonctions pour ajouter un film à la rubrique vues
export const addVue = async (req, res) => {
    try {
        if (req.headers.cookie) {
            const token = jwt.verify(req.headers.cookie.split('=')[1], env.token);
            const username = token.username;
            const filmId = req.body.filmId;
            console.log(username)
            console.log(req.body.filmId)

            if (username) {
                const user = await userModel.findOne({ username: username })

                if (user.dejaVu.includes(filmId) && user.aVoir.includes(filmId)) {
                    await userModel.findOneAndUpdate({ username: username }, { $pull: { aVoir: filmId } })
                    res.status(201).json("Film déjà dans les films vus mais supprimés des films à voir")
                }

                else if (!user.dejaVu.includes(filmId) && user.aVoir.includes(filmId)) {
                    await userModel.findOneAndUpdate({ username: username }, { $push: { dejaVu: filmId }, $pull: { aVoir: filmId } })
                    res.status(201).json("Film ajouté à la rubrique des films vues et retiré des films à voir")
                }

                else {
                    await userModel.findOneAndUpdate({ username: username }, { $push: { dejaVu: filmId } })
                    res.status(201).json("Film ajouté aux films vus")
                }
            }
            else {
                res.status(404).json("Utilisateur introuvable")
            }
        }

    }
    catch (error) {
        console.log(error)
    }
}
// fonctions pour ajouter un film à la rubrique à voir
export const addAVoir = async (req, res) => {
    try {
        if (req.headers.cookie) {
            const token = jwt.verify(req.headers.cookie.split('=')[1], env.token);
            const username = token.username;
            const filmId = req.body.filmId;
            console.log(username)
            console.log(req.body.filmId)
            if (username) {
                const user = await userModel.findOne({ username: username })
                if (user.aVoir.includes(filmId)) {
                    res.status(400).json("Film déjà dans les films à voir")
                }
                else {
                    await userModel.findOneAndUpdate({ username: username }, { $push: { aVoir: filmId } })
                    res.status(201).json("Film ajouté")
                }
            }
            else {
                res.status(404).json("Utilisateur introuvable")
            }
        }

    }
    catch (error) {
        console.log(error)
    }
}
// fonctions pour voir les films favoris 
export const getFavoris = async (req, res) => {
    try {
        const token = jwt.verify(req.headers.cookie.split('=')[1], env.token);
        const username = token.username;
        const user = await userModel.findOne({ username: username });
        const filmsFavoris = await filmModel.find({ _id: user.favoris })
        console.log(filmsFavoris)
        res.status(200).json(filmsFavoris)
    }
    catch (error) {
        console.log(error)
    }
}
// fonctions pour voir les films vues 
export const getVues = async (req, res) => {
    try {
        const token = jwt.verify(req.headers.cookie.split('=')[1], env.token);
        const username = token.username;
        const user = await userModel.findOne({ username: username });
        const filmsVues = await filmModel.find({ _id: user.dejaVu })
        console.log(filmsVues)
        res.status(200).json(filmsVues)
    }
    catch (error) {
        console.log(error)
    }
}
// fonctions pour voir les films à voir 
export const getAVoir = async (req, res) => {
    try {
        const token = jwt.verify(req.headers.cookie.split('=')[1], env.token);
        const username = token.username;
        const user = await userModel.findOne({ username: username });
        const filmsAVoir = await filmModel.find({ _id: user.aVoir })
        console.log(filmsAVoir)
        res.status(200).json(filmsAVoir)
    }
    catch (error) {
        console.log(error)
    }
}
// fonctions pour supprimer un film des favoris
export const removeFavoris = async (req, res) => {
    try {
        if (req.headers.cookie) {
            const token = jwt.verify(req.headers.cookie.split('=')[1], env.token);
            const username = token.username;
            const filmId = req.body.filmId;
            console.log(username)
            console.log(req.body.filmId)
            if (username) {
                const user = await userModel.findOne({ username: username })
                if (user.favoris.includes(filmId)) {
                    await userModel.findOneAndUpdate({ username: username }, { $pull: { favoris: filmId } })
                    res.status(200).json("Film retiré des favoris")
                }
                else {
                    res.status(400).json("Film non trouvé dans les favoris")
                }
            }
            else {
                res.status(404).json("Utilisateur introuvable")
            }
        }

    }
    catch (error) {
        console.log(error)
    }
}
// fonctions pour supprimer un film des vues
export const removeVue = async (req, res) => {
    try {
        if (req.headers.cookie) {
            const token = jwt.verify(req.headers.cookie.split('=')[1], env.token);
            const username = token.username;
            const filmId = req.body.filmId;
            console.log(username)
            console.log(req.body)
            if (username) {
                const user = await userModel.findOne({ username: username })
                if (user.dejaVu.includes(filmId)) {
                    await userModel.findOneAndUpdate({ username: username }, { $pull: { dejaVu: filmId } })
                    res.status(200).json("Film retiré des vues")
                }
                else {
                    res.status(400).json("Film non trouvé dans les vues")
                }
            }
            else {
                res.status(404).json("Utilisateur introuvable")
            }
        }

    }
    catch (error) {
        console.log(error)
    }
}
// fonctions pour supprimer un film des à aVoir
export const removeAVoir = async (req, res) => {
    try {
        if (req.headers.cookie) {
            const token = jwt.verify(req.headers.cookie.split('=')[1], env.token);
            const username = token.username;
            const filmId = req.body.filmId;
            console.log(username)
            console.log(req.body.filmId)
            if (username) {
                const user = await userModel.findOne({ username: username })
                if (user.aVoir.includes(filmId)) {
                    await userModel.findOneAndUpdate({ username: username }, { $pull: { aVoir: filmId } })
                    res.status(200).json("Film retiré des films à voir")
                }
                else {
                    res.status(400).json("Film non trouvé dans les films à voir")
                }
            }
            else {
                res.status(404).json("Utilisateur introuvable")
            }
        }

    }
    catch (error) {
        console.log(error)
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
