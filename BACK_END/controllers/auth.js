const userModel = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { env } = require("../config/index.js");

/**
 * Function to sign up
 * @param {*} req - The request containing the user information to create
 * @param {*} res - The response containing a success or error message
 */
module.exports.signUp = async (req, res) => {
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

module.exports.login = async (req, res) => {
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

module.exports.checkAuth = async (req, res) => {
  try {
    if (req.headers.cookie) {
      const token = req.headers.cookie.split("=")[1];
      const decodedToken = jwt.verify(token, env.token);
      const username = decodedToken.username;
      const expDate = new Date(decodedToken.exp * 1000);
      const now = new Date();

      if (expDate < now) {
        return res.json({ isLoggedIn: false, username: username });
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

module.exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    console.log(req.headers.cookie);
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    console.log(error);
  }
};
