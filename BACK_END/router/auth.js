const express = require("express");
const { signUp, login, checkAuth, logout } = require("../controllers/auth.js");
const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/checkAuth", checkAuth);
router.get("/logout", logout);

module.exports = router;
