// On importe la bibliothèque xlsx
import xlsx from "xlsx";
// On importe le model film
import Film from "../models/film.js";
// On importe axios pour les requêtes ver
import axios from "axios";
// On importe dotenv pour cacher la clé d'API
import { env } from "../config/index.js";

// Fonction pour transformer les données du fichier Excel en données de film
// on va réutiliser cette fonction pour importer les films du fichier excel et pour synchroniser le fichier excel avec la dbb
const transformExcelData = () => {
  // chemin du fichier Excel
  const filePath = "film.xlsx";
  // lecture du fichier Excel
  const workbook = xlsx.readFile(filePath);
  // récupération de la première feuille du fichier Excel
  const sheetName = workbook.SheetNames[0];
  // stockage des données de la première feuille dans un tableau
  const filmsData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  // transformations des données pour les adapter au modèle de film
  return filmsData.map((film) => ({
    _id: film["Id"],
    title: film["Titre"] || "",
    originalTitle: film["Titre original"] || "",
    director: film["Réalisateurs"] || "",
    year: film["Année de production"],
    nationality: film["Nationalité"] || "",
    duration: film["Durée"] || "",
    genre: film["Genre"] || "",
    synopsis: film["Synopsis"] || "",
  }));
};

// fonction pour importer les films du fichier Excel vers la dbb
// on utilise la fonction transformExcelData pour transformer les données du fichier Excel en données de film
export const importFilms = async (req, res) => {
  try {
    // on reprend la fonction de transformation des données du fichier Excel en données de film
    const transformedData = transformExcelData();
    // on supprime tous les films existants dans la dbb
    await Film.deleteMany();
    // on insère les films du fichier Excel dans la dbb
    await Film.insertMany(transformedData);
    console.log("Importation réussie de films importés");

    // on r'envoie un message de succes ainsi qu'un code de statut 201
    res.status(201).json({ message: "Importation réussie" });
    // on attrape les erreurs et on les affiche avec un code de statut 500
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de l'importation" });
  }
};
// fonction pour synchroniser les films du fichier Excel avec la base de données automatiquement
export const synchronizeFilms = async () => {
  try {
    // on reprend la fonction de transformation des données du fichier Excel en données de film
    const transformedData = transformExcelData();
    // on recupere tous les films presents dans la dbb
    const localStorageFilms = await Film.find({});
    // utilisé pour se debugger, stock les id des différences
    const differentIds = [];
    const idForAdd = [];
    const idForDelete = [];
    //On fait une foucle sur tous les films du fichier excel
    transformedData.forEach(async (excelFilm) => {
      // On vérifie si chaque film du fichier Excel existe dans la base de données
      const existingFilm = localStorageFilms.find(
        (localStorageFilm) => localStorageFilm._id === excelFilm._id
      );
      // si le film n'existe pas, on l'ajoute à la base de données
      if (!existingFilm) {
        await Film.create(excelFilm);
        idForAdd.push(excelFilm._id);
        console.log("IDs des films à ajouter :", idForAdd);
        // Si le film existe, on compare chaque champs pour voir si il y a des erreurs,
      } else {
        //  hasdifference passe à true si il detecte une erreur
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
        // si on a détecté une différence sur un des champs du film, on met à jour le film.
        if (hasDifference) {
          await Film.findOneAndUpdate({ _id: existingFilm._id }, excelFilm);
          differentIds.push(existingFilm._id);
          console.log(
            "IDs des films avec des titres différents :",
            differentIds
          );
        }
      }
    });
    // on fait une boucle sur tous les films de la base de données
    localStorageFilms.forEach(async (localStorageFilm) => {
      // on vérifie si chaque film de la base de données existe dans le fichier Excel
      const correspondingId = transformedData.find(
        (film) => film._id === localStorageFilm._id
      );
      // si un film n'existe pas dans le fichier Excel, on le supprime de la base de données
      if (!correspondingId) {
        await Film.findOneAndDelete({ _id: localStorageFilm._id });
        idForDelete.push(localStorageFilm._id);
        console.log("ids des films à supprimer:", idForDelete);
      }
    });
    // on attrape les erreurs eventuelles
  } catch (error) {
    console.log("Error during synchronization:", error);
  }
};

// fonctions pour récupérer les poster des films à partir de leur titre
async function getPosterUrl(title, year) {
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
    const posterPath = response.data.results[0]?.poster_path; // Utilisation de l'opérateur de coalescence nulle (?.) pour vérifier si poster_path est défini
    if (posterPath) {
      return posterPath;
    }
  } catch (error) {
    console.log(`Erreur lors de la récupération de l'image: ${error}`);
  }
}

// Fonction pour récupérer la liste des films avec les URLs des posters
export const getFilms = async (req, res) => {
  console.log(req.query.page);
  try {
    const page = req.query.page || 1; // Récupérer le numéro de la page depuis la requête, par défaut 1
    const filmsPerPage = 20; // Nombre de films par page
    const offset = (page - 1) * filmsPerPage; // Calculer l'offset

    const films = await Film.find({})
      .sort({ _id: 1 })
      .skip(offset)
      .limit(filmsPerPage);

    // Créer un tableau de promesses pour récupérer les URLs des posters de chaque film
    const getImagePromises = films.map((film) =>
      getPosterUrl(film.title, film.year)
    );

    // Attendre que toutes les promesses soient résolues
    const posterPaths = await Promise.all(getImagePromises);

    // Associer chaque URL de poster au film correspondant
    const filmsWithPosters = films.map((film, index) => ({
      ...film.toObject(),
      posterUrl: posterPaths[index] || null, // Utiliser l'URL du poster si disponible, sinon null
    }));

    // Renvoyer la liste des films avec les URLs des posters
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

// fonction pour récuérer un film par therme
export const searchFilmByTerm = async (req, res) => {
  try {
    const term = req.query.term;
    const termNormalized = normalizeString(term);
    const films = await Film.find({});
    const filmsFiletered = films.filter(
      (film) =>
        normalizeString(film.title).includes(termNormalized) ||
        normalizeString(film.originalTitle).includes(termNormalized) ||
        normalizeString(film.director).includes(termNormalized) ||
        normalizeString(film.genre).includes(termNormalized) ||
        normalizeString(film.synopsis).includes(termNormalized)
    );
    const getImagePromises = filmsFiletered.map((film) =>
      getPosterUrl(film.title, film.year)
    );
    // Attendre que toutes les promesses soient résolues
    const posterPaths = await Promise.all(getImagePromises);
    // Associer chaque URL de poster au film correspondant
    const filmsWithPosters = filmsFiletered.map((film, index) => ({
      ...film.toObject(),
      posterUrl: posterPaths[index] || null, // Utiliser l'URL du poster si disponible, sinon null
    }));
    res.json(filmsWithPosters.slice(0, 5));
  } catch (error) {
    console.log(`Erreur lors de la recherche des films: ${error}`);
    res.status(500).json({ message: "Erreur lors de la recherche des films" });
  }
};

// fonction pour compter le nombre de films dans la dbb (utilisé pour la pagination)
export const countFilms = async (req, res) => {
  try {
    const count = await Film.countDocuments();
    res.json({ count });
  } catch (error) {
    console.log(`Erreur lors du comptage des films: ${error}`);
    res.status(500).json({ message: "Erreur lors du comptage des films" });
  }
};

// fonction pour normalizer le texte
function normalizeString(str) {
  if (str === "" || typeof str === "undefined" || str === null) {
    return "";
  }
  return `${str}`
    ?.toLowerCase()
    ?.normalize("NFD")
    ?.replace(/[\u0300-\u036f]/g, "");
}
