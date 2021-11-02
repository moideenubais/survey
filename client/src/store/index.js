import { createSlice, configureStore } from "@reduxjs/toolkit";
import snackBarReducer from "./snackbar";

const store = configureStore({
  reducer: {
    snackbar: snackBarReducer,
  },
});
export default store;
