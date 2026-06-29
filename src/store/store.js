import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./slices/postsSlice";
import themeReducer from "./slices/themeSlice";
import editorReducer from "./slices/editorSlice";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    theme: themeReducer,
    editor: editorReducer,
  },
});

export default store;
