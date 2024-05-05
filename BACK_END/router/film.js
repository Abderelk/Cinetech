const express = require("express");

const {
  importFilms,
  getFilms,
  countFilms,
  searchFilmByTerm,
  getRubriques,
} = require("../controllers/film.js");
// routes pour gérer les films
const router = express.Router();
router.post("/import", importFilms);
router.get("/getFilms", getFilms);
router.get("/count", countFilms);
router.get("/search", searchFilmByTerm);
router.get("/getRubriques", getRubriques);
module.exports = router;
