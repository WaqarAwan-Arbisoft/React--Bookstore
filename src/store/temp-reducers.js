import { createSlice } from "@reduxjs/toolkit";

const initialTempState = {
    errorToasts: [],
    totalCartItems: 0
};
const tempSlice = createSlice({
    name: 'tempStates',
    initialState: initialTempState,
    reducers: {
        addToast(state, action) {
            state.errorToasts = [...state.errorToasts, action.payload];
        },
        setTotalCartItems(state, action) {
            state.totalCartItems = action.payload
        }
    }
});

export const tempActions = tempSlice.actions;
export default tempSlice.reducer;