  import { configureStore } from '@reduxjs/toolkit';
  import authReducer from './authSlice';
  import themeReducer from './themeSlice'; // optional for theme switching

  export const store = configureStore({
    reducer: {
      auth: authReducer,
      theme: themeReducer, // if you have it
    },
  });

  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;
