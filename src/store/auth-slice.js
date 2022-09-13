import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
    isAuthenticated: false,
    token: null,
    email: null,
    username: null,
    id: null,
    role: null
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
            state.id = action.payload.id;
            state.role = action.payload.role
        },
        logout(state) {
            state.isAuthenticated = false;
            state.token = null;
            state.email = null;
            state.username = null;
            state.id = null;
        }
    }
});

export const authAction = authSlice.actions
export default authSlice.reducer;