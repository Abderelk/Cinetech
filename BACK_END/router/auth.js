import express from "express";
import { signUp, login, checkAuth, logout } from "../controllers/auth.js";
const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/checkAuth", checkAuth);
router.get("/logout", logout);
export default router;
