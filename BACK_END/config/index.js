const dotenv = require("dotenv");

dotenv.config();

const env = {
  port: process.env.PORT,
  token: process.env.TOKEN,
  mongoURI: process.env.MONGO_URI,
  cleApi: process.env.CLE_API,
};

module.exports = { env };
