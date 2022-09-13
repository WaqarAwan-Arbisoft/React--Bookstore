import { createSlice } from "@reduxjs/toolkit";

const initialTempState = {
    username: null,
    password: null,
    errorToasts: []
};
const tempSlice = createSlice({
    name: 'tempStates',
    initialState: initialTempState,
    reducers: {
        setCredentials(state, action) {
            state.username = action.payload.username;
            state.password = action.payload.password;
        },
        addToast(state, action) {
            state.errorToasts = [...state.errorToasts, action.payload];
        }
    }
});

export const tempActions = tempSlice.actions;
export default tempSlice.reducer;