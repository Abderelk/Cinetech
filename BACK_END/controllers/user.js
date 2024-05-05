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
    if (req.headers.cookie) {
      const token = jwt.verify(req.headers.cookie.split("=")[1], env.token);
      const username = token.username;
      const filmId = req.body.filmId;
      const rubrique = req.body.rubrique;

      if (username) {
        const user = await userModel.findOne({ username: username });

        if (rubrique === "dejaVu") {
          if (user.dejaVu.includes(filmId) && user.aVoir.includes(filmId)) {
            await userModel.findOneAndUpdate(
              { username: username },
              { $pull: { dejaVu: filmId } }
            );
            res.json("Le film a été ajouté à la liste des films vus.");
          } else if (
            !user.dejaVu.includes(filmId) &&
            user.aVoir.includes(filmId)
          ) {
            await userModel.findOneAndUpdate(
              { username: username },
              { $push: { dejaVu: filmId }, $pull: { aVoir: filmId } }
            );
            res.json(
              "Le Film a été ajouté à la liste des films vus et retiré des films à voir"
            );
          } else {
            await userModel.findOneAndUpdate(
              { username: username },
              { $push: { dejaVu: filmId } }
            );
            res.json("Le film est déjà dans lest films vus");
          }
        } else {
          if (user[rubrique].includes(filmId)) {
            res.json(`Le film est déjà dans la liste des films ${rubrique}.`);
          } else {
            await userModel.findOneAndUpdate(
              { username: username },
              { $push: { [rubrique]: filmId } }
            );
            res.json(`Le film a été ajouté à la liste des films ${rubrique}.`);
          }
        }
      } else {
        res.json("Utilisateur introuvable");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Fonction pour supprimer un film des rubriques favoris, vues ou à voir de l'utilisateur connecté
 * @param {*} req - La requête contenant le film à supprimer des rubriques
 * @param {*} res - La réponse contenant un message de succès ou d'erreur
 */
const removeFromRubrique = async (req, res) => {
  try {
    // Vérifier si un cookie est présent dans les en-têtes de la requête
    if (req.headers.cookie) {
      // Récupérer la rubrique et le filmId à partir du corps de la requête
      const { rubrique, filmId } = req.body;

      // Extraire le nom d'utilisateur du token JWT
      const token = jwt.verify(req.headers.cookie.split("=")[1], env.token);
      const username = token.username;

      // Vérifier si l'utilisateur existe dans la base de données
      const user = await userModel.findOne({ username: username });

      // Vérifier si l'utilisateur existe et si le filmId est dans la rubrique des favoris
      if (user && user[rubrique] && user[rubrique].includes(filmId)) {
        // Mettre à jour la base de données pour retirer le filmId de la rubrique spécifiée
        await userModel.findOneAndUpdate(
          { username: username },
          { $pull: { [rubrique]: filmId } }
        );

        // Renvoyer une réponse JSON avec un message de succès
        res.status(200).json({ message: "Film retiré des favoris" });
      } else {
        // Renvoyer une réponse JSON avec un message d'erreur si le film n'est pas trouvé dans les favoris
        res.status(400).json({ message: "Film non trouvé dans les favoris" });
      }
    } else {
      // Renvoyer une réponse JSON avec un message d'erreur si aucun cookie n'est présent
      res
        .status(401)
        .json({ message: "Cookie manquant dans les en-têtes de la requête" });
    }
  } catch (error) {
    // Capturer et gérer les erreurs
    console.log(error);
    res
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
