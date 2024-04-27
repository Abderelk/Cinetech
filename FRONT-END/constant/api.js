// Tout les URL de l'API sont définis ici, ce qui permet de les modifier facilement et de les réutiliser dans tout le projet.
export const URL = {
  // URL POUR GÉRER LES USERS
  USER_SIGNUP: "http://localhost:8080/api/user/signup",
  USER_LOGIN: "http://localhost:8080/api/user/login",
  USER_CHECK_AUTH: "http://localhost:8080/api/user/checkAuth",
  USER_LOGOUT: "http://localhost:8080/api/user/logout",
  // URL POUR GÉRER LES FAVORIS, VUES ET À VOIR
  ADD_FAVORIS: "http://localhost:8080/api/user/addFavoris",
  ADD_VUES: "http://localhost:8080/api/user/addVue",
  ADD_AVOIR: "http://localhost:8080/api/user/addAvoir",
  GET_FAVORIS: "http://localhost:8080/api/user/getFavoris",
  GET_VUES: "http://localhost:8080/api/user/getVues",
  GET_AVOIR: "http://localhost:8080/api/user/getAVoir",
  REMOVE_FAVORIS: "http://localhost:8080/api/user/removeFavoris",
  REMOVE_VUES: "http://localhost:8080/api/user/removeVues",
  REMOVE_AVOIR: "http://localhost:8080/api/user/removeAVoir",
  // URL POUR GÉRER LES FILMS
  FILM_IMPORT: "http://localhost:8080/api/film/import",
  FILM_GET: "http://localhost:8080/api/film/films",
  FILM_COUNT: "http://localhost:8080/api/film/count",
  FILM_SEARCH: "http://localhost:8080/api/film/search",
};
