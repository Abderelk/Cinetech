const express = require("express");
const { env } = require("./config/index.js");
const mongoose = require("mongoose");
const chokidar = require("chokidar");
const cors = require("cors");
const { synchronizeFilms } = require("./controllers/film.js");
const cookieParser = require("cookie-parser");
const filmRouter = require("./router/film.js");
const userRouter = require("./router/user.js");
const authRouter = require("./router/auth.js");

// server.js
// router
// app express
const app = express();
// port
const PORT = env.port || 8080;
// connexion à mon cluster
mongoose
  .connect(env.mongoURI)
  .then(() => console.log("connexion au cluster mongoDB réussie !"))
  .catch((error) => console.log(error));
// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
// PREFIX ROUTES
app.use("/api/film", filmRouter);
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
// utilisation de chokidar pour détecter les changements dans le fichier film.xlsx(à chaque nouvel enregistrement dans le fichier film.xlsx qu'il y aie un changement ou non on est informé)
const watcher = chokidar.watch("film.xlsx", { persistent: true });
watcher.on("change", async (path) => {
  console.log(`${path} has been changed`);
  // utilisation de la fonction synchronizeFilms présente dans mon controller pour synchroniser les films
  synchronizeFilms();
});
// server
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

synchronizeFilms();
