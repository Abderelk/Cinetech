import express, { Router } from "express";
import { importFilms } from "../controllers/film.controller.js";
import { getFilms } from "../controllers/film.controller.js";
import { getFilmById } from "../controllers/film.controller.js";
import { deleteFilmById } from "../controllers/film.controller.js";

const router = express.Router();
router.post('/import', importFilms)
router.get('/films', getFilms)
router.get('/film/:id', getFilmById)
router.delete('/film/:id', deleteFilmById)

export default router  