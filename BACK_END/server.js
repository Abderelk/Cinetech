// server.js
import express from "express";
import { env } from "./config/index.js";
import mongoose from "mongoose";
import chokidar from "chokidar";
import cors from "cors";
import { synchronizeFilms } from "./controllers/film.controller.js"
import cookieParser from "cookie-parser";
// router
import filmRouter from "./router/film.router.js";
import userRouter from "./router/user.router.js";
// app express
const app = express();
// port
const PORT = env.port || 8080;

// database mongoose

mongoose
    // connexion à ma dbb cinetech
    .connect(env.mongoURI, { dbName: "cinetech" })
    .then(() => console.log("connexion à la dbb cinetech mongoDB réussie !"))
    .catch(error => console.log(error));

mongoose
    // connexion à ma dbb userCinetech
    .connect(env.mongoURI, { dbName: "userCinetech" })
    .then(() => console.log("connexion à la base de données userCinetech mongoDB réussie !"))
    .catch(error => console.log(error));


// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: PORT, credentials: true }));

// PREFIX ROUTES
app.use('/api/film', filmRouter);
app.use('/api/user', userRouter);

// syncronisation
const watcher = chokidar.watch("film.xlsx", { persistent: true });
watcher.on("change", async (path) => {
    console.log(`${path} has been changed`);
    synchronizeFilms();
});
// server

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});