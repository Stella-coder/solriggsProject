// src/RegisterAll/Ebuka/store.js
import { configureStore } from "@reduxjs/toolkit"; // Use configureStore from Redux Toolkit
import marketplaceReducer from "./ReduxGlobal"; // Import the marketplace reducer
// You can add other reducers like productReducer here if needed

const store = configureStore({
  reducer: {
    marketplace: marketplaceReducer, // Integrate the marketplace reducer
    // You can add other slices/reducers here
  },
});

export default store;
