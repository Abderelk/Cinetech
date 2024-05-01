import xlsx from "xlsx";
import Film from "../models/film.js";
import axios from "axios";
import { env } from "../config/index.js";

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

  // Utilisation d'une carte pour stocker les films uniques
  const filmsMap = new Map();

  // Nettoyage des caractères spéciaux et fusion des réalisateurs pour les doublons de films
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
      // Si le film existe déjà, fusionner les réalisateurs
      const existingFilm = filmsMap.get(key);
      existingFilm.director += `, ${cleanFilm.director}`;
    }
  });

  // Retourner les films uniques
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
}

export const getFilms = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const filmsPerPage = 20;
    const offset = (page - 1) * filmsPerPage;

    const films = await Film.find({})
      .sort({ _id: 1 })
      .skip(offset)
      .limit(filmsPerPage);

    const getImagePromises = films.map((film) =>
      getPosterUrl(film.title, film.originalTitle)
    );

    const posterData = await Promise.all(getImagePromises);
    const filmsWithPosters = films.map((film, index) => ({
      ...film.toObject(),
      posterUrl: posterData[index].posterPath || null,
      voteAverage: posterData[index].voteAverage || null,
    }));

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
    ?.replace(/[\u0300-\u036f]/g, "");
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
    const filmsFiletered = films.filter(
      (film) =>
        normalizeString(film.title).includes(termNormalized) ||
        normalizeString(film.originalTitle).includes(termNormalized) ||
        normalizeString(film.director).includes(termNormalized)
    );
    const getImagePromises = filmsFiletered.map((film) =>
      getPosterUrl(film.title, film.originalTitle)
    );
    const posterData = await Promise.all(getImagePromises);
    console.log(posterData);
    const filmsWithPosters = filmsFiletered.map((film, index) => ({
      ...film.toObject(),
      posterUrl: posterData[index].posterPath || null,
      voteAverage: posterData.voteAverage || null,
    }));
    res.json(filmsWithPosters.slice(0, 4));
  } catch (error) {
    console.log(`Erreur lors de la recherche des films: ${error}`);
    res.status(500).json({ message: "Erreur lors de la recherche des films" });
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
