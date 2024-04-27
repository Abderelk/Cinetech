import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT,
  token: process.env.TOKEN,
  mongoURI: process.env.MONGO_URI,
  cleApi: process.env.CLE_API,
};
