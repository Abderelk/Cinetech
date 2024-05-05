import xlsx from "xlsx";
import Film from "../models/film.js";
import userModel from "../models/user.js";
import filmModel from "../models/film.js";
import axios from "axios";
import { env } from "../config/index.js";
import jwt from "jsonwebtoken";

/**
 * Normalise les données du fichier Excel
 * @param {*} data - Les données à normaliser
 * @returns Les données normalisées
 */
const normalizeExcelData = (data) => {
  if (data === "" || typeof data === "undefined" || data === null) {
    return "";
  }
  return `${data}`?.replace(/<[^>]+>/g, "")?.trim();
};

/**
 * Transforme les données du fichier excel en un tableau de films
 * @returns {Array<Object>} Un tableau d'objets représentant les films avex leurs attributs
 */
const transformExcelData = () => {
  const filePath = "film.xlsx";
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const filmsData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  const filmsMap = new Map();

  filmsData.forEach((film) => {
    const key = film.Titre;
    const cleanFilm = {
      _id: film["Id"],
      title: normalizeExcelData(film["Titre"]),
      originalTitle: normalizeExcelData(film["Titre original"]),
      director: normalizeExcelData(film["Réalisateurs"]),
      year: film["Année de production"],
      nationality: normalizeExcelData(film["Nationalité"]),
      duration: normalizeExcelData(film["Durée"]),
      genre: normalizeExcelData(film["Genre"]),
      synopsis: normalizeExcelData(film["Synopsis"]),
    };

    if (!filmsMap.has(key)) {
      filmsMap.set(key, cleanFilm);
    } else {
      const existingFilm = filmsMap.get(key);
      existingFilm.director += `, ${cleanFilm.director}`;
    }
  });

  return [...filmsMap.values()];
};

/**
 * Importe les films du fichier Excel dans la base de données
 * @param {*} res - La réponse HTTP
 */
export const importFilms = async (_, res) => {
  try {
    const transformedData = transformExcelData();
    await Film.deleteMany();
    await Film.insertMany(transformedData);
    console.log("Importation réussie de films importés");

    res.status(201).json({ message: "Importation réussie" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de l'importation" });
  }
};

/**
 * Synchronise les films du fichier Excel avec ceux de la base de données en effectuant deux boucles, une pour ajouter les films manquant et mettre à jour les films existants, et une autre pour supprimer les films qui ne sont plus dans le fichier Excel
 */
export const synchronizeFilms = async () => {
  try {
    const transformedData = transformExcelData();
    const localStorageFilms = await Film.find({});
    const differentIds = [];
    const idForAdd = [];
    const idForDelete = [];
    transformedData.forEach(async (excelFilm) => {
      const existingFilm = localStorageFilms.find(
        (localStorageFilm) => localStorageFilm._id === excelFilm._id
      );
      if (!existingFilm) {
        await Film.create(excelFilm);
        idForAdd.push(excelFilm._id);
      } else {
        let hasDifference = false;
        if (
          existingFilm.title !== excelFilm.title ||
          existingFilm.originalTitle !== excelFilm.originalTitle ||
          existingFilm.director !== excelFilm.director ||
          existingFilm.year !== excelFilm.year ||
          existingFilm.nationality !== excelFilm.nationality ||
          existingFilm.duration !== excelFilm.duration ||
          existingFilm.genre !== excelFilm.genre ||
          existingFilm.synopsis !== excelFilm.synopsis
        ) {
          hasDifference = true;
        }
        if (hasDifference) {
          await Film.findOneAndUpdate({ _id: existingFilm._id }, excelFilm);
          differentIds.push(existingFilm._id);
        }
      }
    });
    localStorageFilms.forEach(async (localStorageFilm) => {
      const correspondingId = transformedData.find(
        (film) => film._id === localStorageFilm._id
      );
      if (!correspondingId) {
        await Film.findOneAndDelete({ _id: localStorageFilm._id });
        idForDelete.push(localStorageFilm._id);
      }
    });
  } catch (error) {
    console.log("Error during synchronization:", error);
  }
};

/**
 * Comptes le nombre de films dans la base de données, nécessaire pour la pagination
 * @param {*} res - La réponse HTTP contenant le nombre de films ou un message d'erreur avec un code 500 en cas d'erreur
 */
export const countFilms = async (_, res) => {
  try {
    const count = await Film.countDocuments();
    res.json({ count });
  } catch (error) {
    console.log(`Erreur lors du comptage des films: ${error}`);
    res.status(500).json({ message: "Erreur lors du comptage des films" });
  }
};

/**
 * Récupère l'URL du poster d'un film à partir de l'API The Movie Database
 * @param {*} title
 * @param {*} originalTitle
 * @returns {String} Le lien du poster du film (URL) ou null si le poster n'est pas trouvé
 */
const getPosterUrl = async (title, originalTitle) => {
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
    const results = response.data.results;

    if (results.length > 0) {
      const posterPath = results[0]?.poster_path;
      const voteAverage = results[0]?.vote_average;
      return { posterPath, voteAverage };
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
      const resultsOriginal = responseOriginal.data.results;

      if (resultsOriginal.length > 0) {
        const posterPathOriginal = resultsOriginal[0]?.poster_path;
        const voteAverageOriginal = resultsOriginal[0]?.vote_average;
        return {
          posterPath: posterPathOriginal,
          voteAverage: voteAverageOriginal,
        };
      } else {
        return { posterPath: null, voteAverage: null };
      }
    }
  } catch (error) {
    console.log(`Erreur lors de la récupération de l'image: ${error}`);
    return { posterPath: null, voteAverage: null };
  }
};

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

    const posterData = await Promise.all(getImagePromises);
    const filmsWithPosters = await films.map((film, index) => ({
      ...film.toObject(),
      posterUrl: posterData[index].posterPath || null,
      voteAverage: posterData[index].voteAverage || null,
    }));

    return filmsWithPosters;
  } catch (error) {
    throw new Error(
      `Erreur lors de la récupération des films avec posters: ${error}`
    );
  }
};

/**
 * Récupère la liste des films de la base de données
 * @param {*} req - La requête HTTP contenant le numéro de la page à récupérer
 * @param {*} res - La réponse contenant la liste des films
 */
export const getFilms = async (req, res) => {
  try {
    const startTime = Date.now();

    const page = req.query.page || 1;
    const filmsPerPage = 20;
    const offset = (page - 1) * filmsPerPage;

    const films = await Film.find()
      .sort({ _id: 1 })
      .skip(offset)
      .limit(filmsPerPage);

    const filmsWithPosters = await getFilmsWithPosters(films);

    const endTime = Date.now();
    console.log(
      `Temps d'exécution de la récupération des images: ${
        endTime - startTime
      } ms`
    );
    res.json(filmsWithPosters);
  } catch (error) {
    console.log(
      `Erreur lors de la récupération de la liste des films: ${error}`
    );
    res.status(500).json({
      message: "Erreur lors de la récupération de la liste des films",
    });
  }
};

/**
 * Récupère la liste des films favoris, vues et à voir de l'utilisateur connecté
 * @param {*} req - La requête contenant les cookies de l'utilisateur connecté
 * @param {*} res - La réponse contenant la liste des films favoris de l'utilisateur ou un message d'erreur
 */
export const getRubriques = async (req, res) => {
  try {
    const rubrique = req.query.rubrique;
    const token = jwt.verify(req.headers.cookie.split("=")[1], env.token);
    const username = token.username;
    const user = await userModel.findOne({ username: username });
    const filmsFavoris = await filmModel.find({ _id: { $in: user[rubrique] } });
    const filmsWithPosters = await getFilmsWithPosters(filmsFavoris);
    res.status(200).json(filmsWithPosters);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des films vus" });
  }
};

/**
 * Normalise une chaîne de caractères en la mettant en minuscule et en retirant les accents, utile pour la recherche de films.
 * @param {*} str - La chaîne de caractères à normaliser
 * @returns {String} La chaîne de caractères normalisée
 */
function normalizeString(str) {
  if (str === "" || typeof str === "undefined" || str === null) {
    return "";
  }
  return `${str}`
    ?.toLowerCase()
    ?.normalize("NFD")
    ?.replace(/[\u0300-\u036f]/g, "")
    .replace(/<[^>]+>/g, "")
    ?.trim();
}

/**
 * Récupère un film en fonction des paramètres de la requête
 * @param {*} req - La requête HTTP contenant les paramètres de recherche (query)
 * @param {*} res - La réponse contenant les films trouvés ou un message d'erreur avec un code 500 en cas d'erreur
 */
export const searchFilmByTerm = async (req, res) => {
  try {
    const term = req.query.term;
    const termNormalized = normalizeString(term);
    const films = await Film.find({});
    const filmsFiltered = films.filter(
      (film) =>
        normalizeString(film.title).includes(termNormalized) ||
        normalizeString(film.originalTitle).includes(termNormalized) ||
        normalizeString(film.director).includes(termNormalized)
    );
    const getImagePromises = filmsFiltered
      .slice(0, 4)
      .map((film) => getPosterUrl(film.title, film.originalTitle));
    const posterData = await Promise.all(getImagePromises);
    const filmsWithPosters = filmsFiltered.slice(0, 4).map((film, index) => ({
      ...film.toObject(),
      posterUrl: posterData[index].posterPath || null,
      voteAverage: posterData[index].voteAverage || null,
    }));
    res.json(filmsWithPosters);
  } catch (error) {
    console.log(`Erreur lors de la recherche des films: ${error}`);
    res.status(500).json({ message: "Erreur lors de la recherche des films" });
  }
};
