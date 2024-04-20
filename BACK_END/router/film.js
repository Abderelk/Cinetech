import express from "express";
import { importFilms } from "../controllers/film.js";
import { getFilms } from "../controllers/film.js";
// routes pour gérer les films
const router = express.Router();
router.post('/import', importFilms)
router.get('/films', getFilms)
export default router  