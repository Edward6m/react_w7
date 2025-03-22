import { configureStore } from "@reduxjs/toolkit";
import toastReducer from './slice/toastSlice';
import userReducer from "./slice/userSlice";

const store = configureStore({
    reducer: {
        user: userReducer,
        toast: toastReducer
    }
})

export default store;