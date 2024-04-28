import express from "express";
import {
  importFilms,
  getFilms,
  countFilms,
  searchFilmByTerm,
} from "../controllers/film.js";
// routes pour gérer les films
const router = express.Router();
router.post("/import", importFilms);
router.get("/films", getFilms);
router.get("/count", countFilms);
router.get("/search", searchFilmByTerm);
export default router;
