const mongoose = require("mongoose");

const cinetechDb = mongoose.connection.useDb("cinetech");
const filmSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  title: { type: String, required: true, unique: true },
  originalTitle: { type: String, required: false, unique: false },
  director: { type: String, required: false },
  year: { type: Number, required: false },
  nationality: { type: String, required: false },
  duration: { type: String, required: false },
  genre: { type: String, required: false },
  synopsis: { type: String, required: false },
});

const Film = cinetechDb.model("Film", filmSchema);
module.exports = Film;
