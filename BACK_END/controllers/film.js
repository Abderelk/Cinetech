// On importe la bibliothèque xlsx
import xlsx from "xlsx";
// On importe le model film
import Film from "../models/film.js";
// On importe axios pour les requêtes ver
import axios from "axios";

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
        .replaceAll(
          "é",
          "%C3%A9"
        )}&include_adult=true&primary_release_year=${year}`,
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTRkNGEwZTBlMmYzNTVmMGZjNmMyZWM1MmFhMzAyZiIsInN1YiI6IjY2MmJmZjU3NmMxOWVhMDEyMjFlMDk0ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NNzyJFI6e0drLcFGt6WSZdmKvO3jBkPavDl8iPV21fc",
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
  try {
    const films = await Film.find({}).sort({ _id: 1 }).limit(50);

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
