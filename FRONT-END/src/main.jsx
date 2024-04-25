import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
// redux
import { Provider } from "react-redux";
import { AuthProvider } from "../context/AuthContext.jsx";
import { UserProvider } from "../context/UserContext.jsx";
import { FilmProvider } from "../context/FilmContext.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FilmProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </FilmProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
