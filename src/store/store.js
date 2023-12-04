import { configureStore } from '@reduxjs/toolkit';
import { authSlice, calendarSlice, uiSlice } from './';

export const store = configureStore({
    reducer: {
        [uiSlice.name]: uiSlice.reducer,
        [calendarSlice.name]: calendarSlice.reducer,
        [authSlice.name]: authSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
