import express from "express";
import {
  signUp,
  login,
  checkAuth,
  logout,
  addFavoris,
  addAVoir,
  addVue,
  getFavoris,
  getAVoir,
  getVues,
  removeAVoir,
  removeFavoris,
  removeVue,
} from "../controllers/user.js";
const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/checkAuth", checkAuth);
router.get("/logout", logout);
router.get("/getFavoris", getFavoris);
router.get("/getAVoir", getAVoir);
router.get("/getVues", getVues);
router.post("/addFavoris", addFavoris);
router.post("/addAVoir", addAVoir);
router.post("/addVue", addVue);
router.post("/removeAVoir", removeAVoir);
router.post("/removeFavoris", removeFavoris);
router.post("/removeVues", removeVue);

export default router;
