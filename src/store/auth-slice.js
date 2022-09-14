import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
    isAuthenticated: false,
    token: null,
    email: null,
    username: null,
    image: null,
    admin: false
}
const authSlice = createSlice({
    name: 'authentication',
    initialState: initialAuthState,
    reducers: {
        login(state, action) {
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.email = action.payload.email;
            state.username = action.payload.username;
            state.image = action.payload.image;
            state.admin = action.payload.admin;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.token = null;
            state.email = null;
            state.username = null;
            state.image = null;
            state.admin = false;
        }
    }
});

export const authAction = authSlice.actions
export default authSlice.reducer;