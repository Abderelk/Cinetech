// Tout les URL de l'API sont définis ici, ce qui permet de les modifier facilement et de les réutiliser dans tout le projet.
export const URL = {
  // URL POUR GÉRER LES authentification
  USER_SIGNUP: "https://api-cinetech.abderrahmane-elkafif.com/api/auth/signup",
  USER_LOGIN: "https://api-cinetech.abderrahmane-elkafif.com/api/auth/login",
  USER_CHECK_AUTH:
    "https://api-cinetech.abderrahmane-elkafif.com/api/auth/checkAuth",
  USER_LOGOUT: "https://api-cinetech.abderrahmane-elkafif.com/api/auth/logout",
  // URL POUR GÉRER LES rubriques des users
  ADD_TORUBRIQUES:
    "https://api-cinetech.abderrahmane-elkafif.com/api/user/addToRubriques",
  REMOVE_FROMRUBRIQUES:
    "https://api-cinetech.abderrahmane-elkafif.com/api/user/removeFromRubrique",
  GET_MOVIESNEARUSER:
    "https://api-cinetech.abderrahmane-elkafif.com/api/user/getFestivalsNearUser",

  // URL POUR GÉRER LES FILMS
  FILM_COUNT: "https://api-cinetech.abderrahmane-elkafif.com/api/film/count",
  FILM_GET: "https://api-cinetech.abderrahmane-elkafif.com/api/film/getFilms",
  GET_RUBRIQUES:
    "https://api-cinetech.abderrahmane-elkafif.com/api/film/getRubriques",
  FILM_SEARCH: "https://api-cinetech.abderrahmane-elkafif.com/api/film/search",
};

// export const URL = {
//   // URL POUR GÉRER LES authentification
//   USER_SIGNUP: "http://localhost:8080/api/auth/signup",
//   USER_LOGIN: "http://localhost:8080/api/auth/login",
//   USER_CHECK_AUTH: "http://localhost:8080/api/auth/checkAuth",
//   USER_LOGOUT: "http://localhost:8080/api/auth/logout",
//   // URL POUR GÉRER LES rubriques des users
//   ADD_TORUBRIQUES: "http://localhost:8080/api/user/addToRubriques",
//   REMOVE_FROMRUBRIQUES: "http://localhost:8080/api/user/removeFromRubrique",
//   GET_MOVIESNEARUSER: "http://localhost:8080/api/user/getFestivalsNearUser",

//   // URL POUR GÉRER LES FILMS
//   FILM_COUNT: "http://localhost:8080/api/film/count",
//   FILM_GET: "http://localhost:8080/api/film/getFilms",
//   GET_RUBRIQUES: "http://localhost:8080/api/film/getRubriques",
//   FILM_SEARCH: "http://localhost:8080/api/film/search",
// };
// // Compare this snippet from FRONT-END/src/context/UserContext.jsx:
