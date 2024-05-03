import userModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/index.js";

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
    const erreur = error.toString();
    if (erreur.includes("Error, expected `email` to be unique")) {
      res.status(400).json("Email déjà utilisé");
      console.log("Email déjà utilisé");
    } else if (erreur.includes("Error, expected `username` to be unique")) {
      res.status(400).json("Nom d'utilisateur déjà utilisé");
      console.log("Nom d'utilisateur déjà utilisé");
    } else if (erreur.includes("ValidationError")) {
      res.status(400).json("Veuillez remplir tous les champs");
      console.log("Veuillez remplir tous les champs");
    } else if (erreur.includes(" data and salt arguments required")) {
      res.status(400).json("Veuillez remplir tous les champs");
      console.log("Veuillez remplir tous les champs");
    } else {
      res.status(400).json("Erreur lors de la création de l'utilisateur");
      console.log("Erreur lors de la création de l'utilisateur");
    }
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
    res
      .cookie("token", token, { httpOnly: true, maxAge: 1000 * 60 * 60 })
      .status(200)
      .json("Connexion réussie !");
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
