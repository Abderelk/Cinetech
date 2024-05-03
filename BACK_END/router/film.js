import express from "express";
import {
  importFilms,
  getFilms,
  countFilms,
  searchFilmByTerm,
  getRubriques,
} from "../controllers/film.js";
// routes pour gérer les films
const router = express.Router();
router.post("/import", importFilms);
router.get("/getFilms", getFilms);
router.get("/count", countFilms);
router.get("/search", searchFilmByTerm);
router.get("/getRubriques", getRubriques);
export default router;
