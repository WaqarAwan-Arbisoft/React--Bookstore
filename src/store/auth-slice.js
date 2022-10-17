import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
    isAuthenticated: false,
    token: null,
    id: null,
    email: null,
    username: null,
    image: null,
}
const authSlice = createSlice({
    name: 'authentication',
    initialState: initialAuthState,
    reducers: {
        login(state, action) {
            state.isAuthenticated = true;
            state.id = action.payload.id;
            state.token = action.payload.token;
            state.email = action.payload.email;
            state.username = action.payload.username;
            state.image = action.payload.image;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.id = null;
            state.token = null;
            state.email = null;
            state.username = null;
            state.image = null;
        }
    }
});

export const authAction = authSlice.actions
export default authSlice.reducer;