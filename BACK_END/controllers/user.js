import userModel from "../models/user.js";
import filmModel from "../models/film.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/index.js";
import axios from "axios";

/**
 * Fonction pour s'inscrire
 * @param {*} req - La requête contenant les informations de l'utilisateur à créer
 * @param {*} res - La réponse contenant un message de succès ou d'erreur
 */

export const signUp = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await userModel.create({
      ...req.body,
      password: hashedPassword,
    });
    res.status(201).json({ message: "User created successfully!", newUser });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Fonction pour se connecter
 * @param {*} req - La requête contenant les informations de l'utilisateur à connecter
 * @param {*} res - La réponse contenant un message de succès ou d'erreur et un token d'authentication en cas de succès qui sera stocké dans un cookie
 */

export const login = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("Utilisateur introuvable");
    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!comparePassword) return res.status(400).json("Mauvais mot de passe");
    const token = jwt.sign({ username: user.username }, env.token);
    const { password, ...Utilisateur } = user._doc;
    res
      .cookie("token", token, { httpOnly: true, maxAge: 1000 * 60 * 60 })
      .status(200)
      .json(Utilisateur);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Fonction pour vérifier si l'utilisateur est connecté
 * @param {*} req - La requête contenant les cookies de l'utilisateur
 * @param {*} res - La réponse contenant un message de succès ou d'erreur et isLoggedIn à true si l'utilisateur est connecté, sinon false
 */

export const checkAuth = async (req, res) => {
  try {
    if (req.headers.cookie) {
      const token = req.headers.cookie.split("=")[1];
      const decodedToken = jwt.verify(token, env.token);
      const username = decodedToken.username;
      const expDate = new Date(decodedToken.exp * 1000);
      const now = new Date();
      if (expDate < now) {
        return res.json({ isLoggedIn: false });
      } else {
        return res.status(200).json({ isLoggedIn: true, username: username });
      }
    }
    return res.json({ isLoggedIn: false });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Fonction pour ajouter un film aux favoris
 * @param {*} req - La requête contenant le film à ajouter aux favoris
 * @param {*} res - La réponse contenant un message de succès ou d'erreur
 */

export const addFavoris = async (req, res) => {
  try {
    if (req.headers.cookie) {
      const token = jwt.verify(req.headers.cookie.split("=")[1], env.token);
      const username = token.username;
      const filmId = req.body.filmId;
      if (username) {
        const user = await userModel.findOne({ username: username });
        if (user.favoris.includes(filmId)) {
          res.status(400).json("Film déjà dans les favoris");
        } else {
          await userModel.findOneAndUpdate(
            { username: username },
            { $push: { favoris: filmId } }
          );
          res.status(201).json("Film ajouté");
        }
      } else {
        res.status(404).json("Utilisateur introuvable");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Fonction pour ajouter un film à la rubrique à voir
 * @param {*} req - La requête contenant le film à ajouter aux à voir
 * @param {*} res - La réponse contenant un message de succès ou d'erreur
 */

export const addAVoir = async (req, res) => {
  try {
    if (req.headers.cookie) {
      const token = jwt.verify(req.headers.cookie.split("=")[1], env.token);
      const username = token.username;
      const filmId = req.body.filmId;
      console.log(username);
      console.log(req.body.filmId);
      if (username) {
        const user = await userModel.findOne({ username: username });
        if (user.aVoir.includes(filmId)) {
          res.status(400).json("Film déjà dans les films à voir");
        } else {
          await userModel.findOneAndUpdate(
            { username: username },
            { $push: { aVoir: filmId } }
          );
          res.status(201).json("Film ajouté");
        }
      } else {
        res.status(404).json("Utilisateur introuvable");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Fonction pour ajouter un film à la rubrique vues, si le film est dans la rubrique à voir, il sera retiré de cette rubrique et ajouté à la rubrique vues.
 * @param {*} req - La requête contenant le film à ajouter aux vues
 * @param {*} res - La réponse contenant un message de succès ou d'erreur
 */

export const addVue = async (req, res) => {
  try {
    if (req.headers.cookie) {
      const token = jwt.verify(req.headers.cookie.split("=")[1], env.token);
      const username = token.username;
      const filmId = req.body.filmId;
      if (username) {
        const user = await userModel.findOne({ username: username });
        if (user.dejaVu.includes(filmId) && user.aVoir.includes(filmId)) {
          await userModel.findOneAndUpdate(
            { username: username },
            { $pull: { aVoir: filmId } }
          );
          res
            .status(201)
            .json(
              "Film déjà dans les films vus mais supprimés des films à voir"
            );
        } else if (
          !user.dejaVu.includes(filmId) &&
          user.aVoir.includes(filmId)
        ) {
          await userModel.findOneAndUpdate(
            { username: username },
            { $push: { dejaVu: filmId }, $pull: { aVoir: filmId } }
          );
          res
            .status(201)
            .json(
              "Film ajouté à la rubrique des films vues et retiré des films à voir"
            );
        } else {
          await userModel.findOneAndUpdate(
            { username: username },
            { $push: { dejaVu: filmId } }
          );
          res.status(201).json("Film ajouté aux films vus");
        }
      } else {
        res.status(404).json("Utilisateur introuvable");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Récupère l'URL du poster d'un film à partir de l'API The Movie Database
 * @param {*} title
 * @param {*} originalTitle
 * @returns {String} Le lien du poster du film (URL) ou null si le poster n'est pas trouvé
 */

async function getPosterUrl(title, originalTitle) {
  try {
    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/search/movie?query=${title
        .replaceAll(" ", "%20")
        .replaceAll("'", "%27")
        .replaceAll("é", "%C3%A9")}&include_adult=false`,
      headers: {
        accept: "application/json",
        Authorization: env.cleApi,
      },
    };
    const response = await axios.request(options);
    const posterPath = response.data.results[0]?.poster_path;
    if (posterPath) {
      return posterPath;
    } else {
      const optionsOriginal = {
        method: "GET",
        url: `https://api.themoviedb.org/3/search/movie?query=${originalTitle
          .replaceAll(" ", "%20")
          .replaceAll("'", "%27")
          .replaceAll("é", "%C3%A9")}&include_adult=false`,
        headers: {
          accept: "application/json",
          Authorization: env.cleApi,
        },
      };
      const responseOriginal = await axios.request(optionsOriginal);
      const posterPathOriginal = responseOriginal.data.results[0]?.poster_path;
      return posterPathOriginal || null;
    }
  } catch (error) {
    console.log(`Erreur lors de la récupération de l'image: ${error}`);
    return null;
  }
}
/**
 * Récupère les films avec leurs posters à partir de la liste de films
 * @param {*} films - Les films à récupérer avec les posters
 * @returns {Array} Les films avec les posters
 */
const getFilmsWithPosters = async (films) => {
  try {
    const getImagePromises = films.map((film) =>
      getPosterUrl(film.title, film.originalTitle)
    );
    const posterPaths = await Promise.all(getImagePromises);
    const filmsWithPosters = films.map((film, index) => ({
      ...film.toObject(),
      posterUrl: posterPaths[index] || null,
    }));
    return filmsWithPosters;
  } catch (error) {
    throw new Error(
      `Erreur lors de la récupération des films avec posters: ${error}`
    );
  }
};
/**
 * Récupère la liste des films favoris, vues et à voir de l'utilisateur connecté
 * @param {*} req - La requête contenant les cookies de l'utilisateur connecté
 * @param {*} res - La réponse contenant la liste des films favoris de l'utilisateur ou un message d'erreur
 */

export const getFavoris = async (req, res) => {
  try {
    const token = jwt.verify(req.headers.cookie.split("=")[1], env.token);
    const username = token.username;
    const user = await userModel.findOne({ username: username });
    const filmsFavoris = await filmModel.find({ _id: user.favoris });
    const filmsWithPosters = await getFilmsWithPosters(filmsFavoris);
    res.status(200).json(filmsWithPosters);
    console.log(filmsWithPosters);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des favoris" });
  }
};

export const getVues = async (req, res) => {
  try {
    const token = jwt.verify(req.headers.cookie.split("=")[1], env.token);
    const username = token.username;
    const user = await userModel.findOne({ username: username });
    const filmsVues = await filmModel.find({ _id: user.dejaVu });
    const filmsWithPosters = await getFilmsWithPosters(filmsVues);
    res.status(200).json(filmsWithPosters);
    console.log(filmsWithPosters);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des films vus" });
  }
};

export const getAVoir = async (req, res) => {
  try {
    const token = jwt.verify(req.headers.cookie.split("=")[1], env.token);
    const username = token.username;
    const user = await userModel.findOne({ username: username });
    const filmsAVoir = await filmModel.find({ _id: user.aVoir });
    const filmsWithPosters = await getFilmsWithPosters(filmsAVoir);
    res.status(200).json(filmsWithPosters);
    console.log(filmsWithPosters);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des films à voir" });
  }
};

/**
 * Fonction pour supprimer un film des rubriques favoris, vues ou à voir de l'utilisateur connecté
 * @param {*} req - La requête contenant le film à supprimer des rubriques
 * @param {*} res - La réponse contenant un message de succès ou d'erreur
 */

export const removeFavoris = async (req, res) => {
  try {
    if (req.headers.cookie) {
      const token = jwt.verify(req.headers.cookie.split("=")[1], env.token);
      const username = token.username;
      const filmId = req.body.filmId;
      console.log(username);
      console.log(req.body.filmId);
      if (username) {
        const user = await userModel.findOne({ username: username });
        if (user.favoris.includes(filmId)) {
          await userModel.findOneAndUpdate(
            { username: username },
            { $pull: { favoris: filmId } }
          );
          res.status(200).json("Film retiré des favoris");
        } else {
          res.status(400).json("Film non trouvé dans les favoris");
        }
      } else {
        res.status(404).json("Utilisateur introuvable");
      }
    }
  } catch (error) {
    console.log(error);
  }
};
export const removeVue = async (req, res) => {
  try {
    if (req.headers.cookie) {
      const token = jwt.verify(req.headers.cookie.split("=")[1], env.token);
      const username = token.username;
      const filmId = req.body.filmId;
      console.log(username);
      console.log(req.body);
      if (username) {
        const user = await userModel.findOne({ username: username });
        if (user.dejaVu.includes(filmId)) {
          await userModel.findOneAndUpdate(
            { username: username },
            { $pull: { dejaVu: filmId } }
          );
          res.status(200).json("Film retiré des vues");
        } else {
          res.status(400).json("Film non trouvé dans les vues");
        }
      } else {
        res.status(404).json("Utilisateur introuvable");
      }
    }
  } catch (error) {
    console.log(error);
  }
};
export const removeAVoir = async (req, res) => {
  try {
    if (req.headers.cookie) {
      const token = jwt.verify(req.headers.cookie.split("=")[1], env.token);
      const username = token.username;
      const filmId = req.body.filmId;
      console.log(username);
      console.log(req.body.filmId);
      if (username) {
        const user = await userModel.findOne({ username: username });
        if (user.aVoir.includes(filmId)) {
          await userModel.findOneAndUpdate(
            { username: username },
            { $pull: { aVoir: filmId } }
          );
          res.status(200).json("Film retiré des films à voir");
        } else {
          res.status(400).json("Film non trouvé dans les films à voir");
        }
      } else {
        res.status(404).json("Utilisateur introuvable");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Fonction pour se déconnecter
 * @param {*} req - La requête contenant les cookies de l'utilisateur connecté
 * @param {*} res - La réponse contenant un message de succès
 */

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    console.log(req.headers.cookie);
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    console.log(error);
  }
};