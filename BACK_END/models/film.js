import mongoose from "mongoose";
const cinetechDb = mongoose.connection.useDb("cinetech");
const filmSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  title: { type: String, required: true, unique: true },
  originalTitle: { type: String, required: false, unique: true },
  director: { type: String, required: false },
  year: { type: Number, required: false },
  nationality: { type: String, required: false },
  duration: { type: String, required: false },
  genre: { type: String, required: false },
  synopsis: { type: String, required: false },
});

const Film = cinetechDb.model("Film", filmSchema);
export default Film;
