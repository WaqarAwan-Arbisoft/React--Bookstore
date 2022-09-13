import { configureStore } from "@reduxjs/toolkit";

import authReducer from './auth-slice';
import tempReducers from "./temp-reducers";

const store = configureStore({
    reducer: { auth: authReducer, temp: tempReducers },
});

export default store;