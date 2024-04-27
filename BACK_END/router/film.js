import express from "express";
import { importFilms } from "../controllers/film.js";
import { getFilms } from "../controllers/film.js";
import { countFilms } from "../controllers/film.js";
import { searchFilmByTerm } from "../controllers/film.js";
// routes pour gérer les films
const router = express.Router();
router.post("/import", importFilms);
router.get("/films", getFilms);
router.get("/count", countFilms);
router.get("/search", searchFilmByTerm);
export default router;
