const express = require("express");

const {
  addToRubriques,
  removeFromRubrique,
  getFestivalsNearUser,
} = require("../controllers/user.js");
const router = express.Router();

router.post("/addToRubriques", addToRubriques);
router.post("/removeFromRubrique", removeFromRubrique);
router.get("/getFestivalsNearUser", getFestivalsNearUser);

module.exports = router;
