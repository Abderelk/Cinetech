import express from "express";
import { addToRubriques, removeFromRubrique } from "../controllers/user.js";
const router = express.Router();

router.post("/addToRubriques", addToRubriques);
router.post("/removeFromRubrique", removeFromRubrique);
export default router;
