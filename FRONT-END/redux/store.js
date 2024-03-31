import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user.reducer";
import filmReducer from "./film.reducer";
export default configureStore({
    reducer: {
        auth: userReducer,
        film: filmReducer
    }
})

