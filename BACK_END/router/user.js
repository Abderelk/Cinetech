import express from "express";
import {
  addToRubriques,
  removeFromRubrique,
  getFestivalsNearUser,
} from "../controllers/user.js";
const router = express.Router();

router.post("/addToRubriques", addToRubriques);
router.post("/removeFromRubrique", removeFromRubrique);
router.get("/getFestivalsNearUser", getFestivalsNearUser);

export default router;
