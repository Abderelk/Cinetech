import { configureStore } from "@reduxjs/toolkit";
import filmReducer from "./film.reducer";
export default configureStore({
    reducer: {
        film: filmReducer
    }
})

