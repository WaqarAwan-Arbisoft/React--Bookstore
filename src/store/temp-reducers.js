import { createSlice } from "@reduxjs/toolkit";

const initialTempState = {
    errorToasts: [],
    successToasts: [],
};
const tempSlice = createSlice({
    name: 'tempStates',
    initialState: initialTempState,
    reducers: {
        addErrorToast(state, action) {
            state.errorToasts = [...state.errorToasts, action.payload];
        },
        addSuccessToast(state, action) {
            state.successToasts = [...state.successToasts, action.payload];
        }
    }
});

export const tempActions = tempSlice.actions;
export default tempSlice.reducer;