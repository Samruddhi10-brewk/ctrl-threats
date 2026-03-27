import {configureStore} from "@reduxjs/toolkit";
import {persistStore, persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./store/features/auth/authSlice";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

const persistConfig = {
    key: "root",
    storage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);
export const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
            },
        }),
});

export const persistor = persistStore(store);


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

