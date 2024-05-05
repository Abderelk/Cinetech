const mongoose = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");

const userCinetechDb = mongoose.connection.useDb("userCinetech");
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  favoris: {
    type: Array,
    required: false,
  },
  aVoir: {
    type: Array,
    required: false,
  },
  dejaVu: {
    type: Array,
    required: false,
  },
});

userSchema.plugin(mongooseUniqueValidator);

const userModel = userCinetechDb.model("User", userSchema);
module.exports = userModel;
