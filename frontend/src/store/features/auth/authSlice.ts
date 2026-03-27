import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    currentUser: null
}
const authSlice = createSlice({
    initialState,
    name: "auth",
    reducers: {
        loginSuccess: (state, action) => {
            state.currentUser = action.payload;
        },
        logoutUser: (state) => {
            state.currentUser = null;
        }
    }
}
)


export default authSlice.reducer
export const {logoutUser, loginSuccess} = authSlice.actions;

