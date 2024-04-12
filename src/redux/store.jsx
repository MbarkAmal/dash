import { configureStore } from "@reduxjs/toolkit";
import userReducer  from './userSlice';
import productReducer from './productSlice';
import orderReducer from './orderSlice';

const store = configureStore({
    reducer: {
        users : userReducer ,

        products : productReducer ,

        orders : orderReducer,
  },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
    }),
})

export default store; 