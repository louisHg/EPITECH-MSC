import { configureStore } from "@reduxjs/toolkit";
import sourceReducer from "./slice/sourceSlice";

export const store = configureStore({
  reducer: {
    source: sourceReducer,
  },
});
