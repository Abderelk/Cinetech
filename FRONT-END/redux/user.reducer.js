import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
    loading: true,
    error: false
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        fetchDataSuccess: (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = false; // Assurez-vous de réinitialiser l'erreur à false en cas de succès
        },
        fetchDataFailure: (state) => {
            state.loading = false;
            state.error = true;
        }
    }
});

export const { fetchDataSuccess, fetchDataFailure } = userSlice.actions;
export default userSlice.reducer;
