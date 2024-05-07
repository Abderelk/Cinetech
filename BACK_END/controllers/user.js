const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const { env } = require("../config/index");
const axios = require("axios");

/**
 * Fonction pour ajouter un film aux favoris
 * @param {*} req - La requête contenant le film à ajouter aux favoris
 * @param {*} res - La réponse contenant un message de succès ou d'erreur
 */
const addToRubriques = async (req, res) => {
  try {
    const authCookieName = "token";

    if (req.headers.cookie) {
      const authCookie = req.headers.cookie
        .split(";")
        .find((cookie) => cookie.trim().startsWith(authCookieName + "="));

      if (authCookie) {
        // Extraire le token du cookie
        const token = authCookie.split("=")[1];
        const decodedToken = jwt.verify(token, env.token);
        const username = decodedToken.username;
        const filmId = req.body.filmId;
        const rubrique = req.body.rubrique;

        if (username) {
          // Rechercher l'utilisateur dans la base de données
          const user = await userModel.findOne({ username });

          if (rubrique === "dejaVu") {
            if (user.dejaVu.includes(filmId) && user.aVoir.includes(filmId)) {
              // Retirer le film de la rubrique aVoir
              await userModel.findOneAndUpdate(
                { username },
                { $pull: { dejaVu: filmId } }
              );
              return res.json("Le film a été ajouté à la liste des films vus.");
            } else if (
              !user.dejaVu.includes(filmId) &&
              user.aVoir.includes(filmId)
            ) {
              // Ajouter le film à dejaVu et le retirer de aVoir
              await userModel.findOneAndUpdate(
                { username },
                { $push: { dejaVu: filmId }, $pull: { aVoir: filmId } }
              );
              return res.json(
                "Le film a été ajouté à la liste des films vus et retiré de la liste des films à voir."
              );
            } else {
              // Ajouter le film à dejaVu
              await userModel.findOneAndUpdate(
                { username },
                { $push: { dejaVu: filmId } }
              );
              return res.json("Le film a été ajouté à la liste des films vus.");
            }
          } else {
            // Vérifier si le film est déjà dans la rubrique spécifiée
            if (user[rubrique].includes(filmId)) {
              return res.json(
                `Le film est déjà dans la liste des films ${rubrique}.`
              );
            } else {
              // Ajouter le film à la rubrique spécifiée
              await userModel.findOneAndUpdate(
                { username },
                { $push: { [rubrique]: filmId } }
              );
              return res.json(
                `Le film a été ajouté à la liste des films ${rubrique}.`
              );
            }
          }
        } else {
          return res.json("Utilisateur introuvable");
        }
      }
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Erreur lors de l'ajout du film à la rubrique" });
  }
};

/**
 * Fonction pour supprimer un film des rubriques favoris, vues ou à voir de l'utilisateur connecté
 * @param {*} req - La requête contenant le film à supprimer des rubriques
 * @param {*} res - La réponse contenant un message de succès ou d'erreur
 */
const removeFromRubrique = async (req, res) => {
  try {
    const { rubrique, filmId } = req.body;
    const authCookieName = "token";

    if (req.headers.cookie) {
      // Recherchez le cookie d'authentification spécifique
      const authCookie = req.headers.cookie
        .split(";")
        .find((cookie) => cookie.trim().startsWith(authCookieName + "="));

      if (authCookie) {
        // Extraire le token du cookie
        const token = authCookie.split("=")[1];
        // Vérifier le token JWT
        const decodedToken = jwt.verify(token, env.token);
        const username = decodedToken.username;

        // Vérifier si l'utilisateur existe dans la base de données
        const user = await userModel.findOne({ username });

        // Vérifier si l'utilisateur existe et si le filmId est dans la rubrique des favoris
        if (user && user[rubrique] && user[rubrique].includes(filmId)) {
          // Mettre à jour la base de données pour retirer le filmId de la rubrique spécifiée
          await userModel.findOneAndUpdate(
            { username },
            { $pull: { [rubrique]: filmId } }
          );
          // Renvoyer une réponse JSON avec un message de succès
          return res.status(200).json({ message: "Film retiré des favoris" });
        } else {
          // Renvoyer une réponse JSON avec un message d'erreur si le film n'est pas trouvé dans les favoris
          return res
            .status(400)
            .json({ message: "Film non trouvé dans les favoris" });
        }
      } else {
        // Renvoyer une réponse JSON avec un message d'erreur si aucun cookie n'est présent
        return res
          .status(401)
          .json({ message: "Cookie manquant dans les en-têtes de la requête" });
      }
    } else {
      // Renvoyer une réponse JSON avec un message d'erreur si aucun cookie n'est présent
      return res
        .status(401)
        .json({ message: "Cookie manquant dans les en-têtes de la requête" });
    }
  } catch (error) {
    // Capturer et gérer les erreurs
    console.log(error);
    return res
      .status(500)
      .json({ message: "Erreur lors du retrait du film des favoris" });
  }
};

/**
 * Fonctino pour récupérer les festivals près de l'utilisateur
 * @param {*} req - La requête contenant les coordonnées de l'utilisateur
 * @param {*} res - La réponse contenant les festivals trouvés près de l'utilisateur
 * @returns
 */
const getFestivalsNearUser = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const max_km = 50;
    const limit = 30;

    const url = `https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/festivals-global-festivals-_-pl/records?where=%20within_distance(geocodage_xy%2C%20geom'POINT(${lng}%20${lat})'%2C%20${max_km}km)&limit=${limit}&refine=discipline_dominante%3A%22Cin%C3%A9ma%2C%20audiovisuel%22`;

    const response = await axios.get(url);
    const festival = response.data.results;
    return res.status(200).json(festival);
  } catch (err) {
    console.error("Erreur lors de la récupération des festivals :", err);
    return res
      .status(500)
      .json({ error: "Erreur lors de la récupération des festivals" });
  }
};

module.exports = {
  addToRubriques,
  removeFromRubrique,
  getFestivalsNearUser,
};
