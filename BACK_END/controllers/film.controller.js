// film.controller.js
import xlsx from "xlsx";
import Film from "../models/film.model.js";

// Fonction pour transformer les données du fichier Excel en données de film
const transformExcelData = () => {
    const filePath = "film.xlsx";
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const filmsData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    return filmsData.map(film => ({
        _id: film["Id"],
        title: film["Titre"] || "",
        originalTitle: film["Titre original"] || "",
        director: film["Réalisateurs"] || "",
        year: film["Année de production"],
        nationality: film["Nationalité"] || "",
        duration: film["Durée"] || "",
        genre: film["Genre"] || "",
        synopsis: film["Synopsis"] || ""
    }));
};
// fonction pour importer les films du fichier Excel vers la dbb
export const importFilms = async (req, res) => {
    try {
        const transformedData = transformExcelData();
        // suppresion des données de la bdd actuel et insertion des nouvelles données.
        await Film.deleteMany();
        await Film.insertMany(transformedData);
        res.status(201).json({ message: "Importation réussie" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de l'importation" });
    }
};
// fonction pour synchroniser les films du fichier Excel avec la base de données automatiquement 
export const synchronizeFilms = async () => {
    try {
        // Transformez les données du fichier Excel en données de film
        const transformedData = transformExcelData();
        // Récupérez les films existants dans la base de données
        const localStorageFilms = await Film.find({});
        // Stockez les IDs des films différents (pour les titres différents)
        const differentIds = [];
        // Stockez les IDs des films à ajouter
        const idForAdd = [];
        // stockez les Ids des films à supprimer
        const idForDelete = []
        // Parcourez les films du fichier Excel
        transformedData.forEach(async excelFilm => {
            // Vérifiez si le film du fichier Excel existe dans la base de données
            const existingFilm = localStorageFilms.find(localStorageFilm => localStorageFilm._id === excelFilm._id);
            if (!existingFilm) {
                await Film.create(excelFilm);
                idForAdd.push(excelFilm._id);
                console.log("IDs des films à ajouter :", idForAdd);
            } else {
                // Si le film existe, comparez les champs et mettez à jour si nécessaire
                let hasDifference = false;
                if (existingFilm.title !== excelFilm.title ||
                    existingFilm.originalTitle !== excelFilm.originalTitle ||
                    existingFilm.director !== excelFilm.director ||
                    existingFilm.year !== excelFilm.year ||
                    existingFilm.nationality !== excelFilm.nationality ||
                    existingFilm.duration !== excelFilm.duration ||
                    existingFilm.genre !== excelFilm.genre ||
                    existingFilm.synopsis !== excelFilm.synopsis) {
                    hasDifference = true;
                }
                if (hasDifference) {
                    await Film.findOneAndUpdate({ _id: existingFilm._id }, excelFilm);
                    differentIds.push(existingFilm._id);
                    console.log("IDs des films avec des titres différents :", differentIds);
                }
            }
        });
        // Supprimez les films qui existent dans la base de données mais pas dans le fichier Excel
        localStorageFilms.forEach(async localStorageFilm => {
            const correspondingId = transformedData.find(film => film._id === localStorageFilm._id);
            if (!correspondingId) {
                await Film.findOneAndDelete({ _id: localStorageFilm._id });
                idForDelete.push(localStorageFilm._id)
                console.log("ids des films à supprimer:", idForDelete)
            }
        });
    } catch (error) {
        console.log("Error during synchronization:", error);
    }
}

// fonction pour récupérer la liste des films
export const getFilms = async (req, res) => {
    try {
        const films = await Film.find({});
        res.json(films);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la récupération de la liste des films" });
    }
};

// fonction pour récupérer un film par son id
export const getFilmById = async (req, res) => {
    try {
        const film = await Film.findById(req.params.id);
        console.log(Film.findById({}))
        res.json(film);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la récupération du film" });
    }
};

export const deleteFilmById = async (req, res) => {
    try {
        const data = await Film.findByIdAndDelete(req.params.id);
        if (!data) {
            return res.status(404).json({ message: "Film non trouvé" });
        }
        res.json({ message: "Film supprimé avec succès", data });
    } catch {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la suppression du film" });
    }
}