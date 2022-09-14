import { createSlice } from "@reduxjs/toolkit";

const initialTempState = {
    email: null,
    password: null,
    errorToasts: []
};
const tempSlice = createSlice({
    name: 'tempStates',
    initialState: initialTempState,
    reducers: {
        setCredentials(state, action) {
            state.email = action.payload.email;
            state.password = action.payload.password;
        },
        addToast(state, action) {
            state.errorToasts = [...state.errorToasts, action.payload];
        }
    }
});

export const tempActions = tempSlice.actions;
export default tempSlice.reducer;