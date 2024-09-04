import {configureStore} from "@reduxjs/toolkit";
import { userAPI } from "./api/userAPI";
import { userReducer } from "./reducer/userReducer";
import { productAPI } from "./api/productAPI";

export const server = import.meta.env.BASE_URL;

export const store = configureStore({
    reducer : {
        [userAPI.reducerPath] : userAPI.reducer, 
        [productAPI.reducerPath] : productAPI.reducer, 
        [userReducer.name] : userReducer.reducer,
    }, 

    middleware: (mid) =>
        mid().concat(userAPI.middleware).concat(productAPI.middleware),
});