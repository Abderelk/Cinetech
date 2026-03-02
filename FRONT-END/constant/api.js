const API_BASE = import.meta.env.VITE_API_URL || "";

export const URL = {
  USER_SIGNUP: `${API_BASE}/api/auth/signup`,
  USER_LOGIN: `${API_BASE}/api/auth/login`,
  USER_CHECK_AUTH: `${API_BASE}/api/auth/checkAuth`,
  USER_LOGOUT: `${API_BASE}/api/auth/logout`,
  ADD_TORUBRIQUES: `${API_BASE}/api/user/addToRubriques`,
  REMOVE_FROMRUBRIQUES: `${API_BASE}/api/user/removeFromRubrique`,
  GET_MOVIESNEARUSER: `${API_BASE}/api/user/getFestivalsNearUser`,
  FILM_COUNT: `${API_BASE}/api/film/count`,
  FILM_GET: `${API_BASE}/api/film/getFilms`,
  GET_RUBRIQUES: `${API_BASE}/api/film/getRubriques`,
  FILM_SEARCH: `${API_BASE}/api/film/search`,
};