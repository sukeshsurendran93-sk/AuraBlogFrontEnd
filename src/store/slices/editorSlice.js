import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  summarizeArticle,
  getWritingSuggestions,
  checkGrammarAndReadability,
} from "../../services/aiService";

export const generateSummary = createAsyncThunk(
  "editor/generateSummary",
  async (content, { rejectWithValue }) => {
    try {
      return await summarizeArticle(content);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchSuggestions = createAsyncThunk(
  "editor/fetchSuggestions",
  async (content, { rejectWithValue }) => {
    try {
      return await getWritingSuggestions(content);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const checkGrammar = createAsyncThunk(
  "editor/checkGrammar",
  async (content, { rejectWithValue }) => {
    try {
      return await checkGrammarAndReadability(content);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const editorSlice = createSlice({
  name: "editor",
  initialState: {
    title: "",
    content: "",
    summary: "",
    category: "Technology",
    tags: "",
    aiSummary: "",
    suggestions: [],
    grammarScore: null,
    loadingSummary: false,
    loadingSuggestions: false,
    loadingGrammar: false,
    errorSummary: null,
    errorSuggestions: null,
    errorGrammar: null,
    activeTab: "edit",
  },
  reducers: {
    setEditorField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetEditor: (state) => {
      state.title = "";
      state.content = "";
      state.summary = "";
      state.category = "Technology";
      state.tags = "";
      state.aiSummary = "";
      state.suggestions = [];
      state.grammarScore = null;
      state.loadingSummary = false;
      state.loadingSuggestions = false;
      state.loadingGrammar = false;
      state.errorSummary = null;
      state.errorSuggestions = null;
      state.errorGrammar = null;
      state.activeTab = "edit";
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateSummary.pending, (state) => {
        state.loadingSummary = true;
        state.errorSummary = null;
      })
      .addCase(generateSummary.fulfilled, (state, action) => {
        state.aiSummary = action.payload;
        state.summary = action.payload;
        state.loadingSummary = false;
      })
      .addCase(generateSummary.rejected, (state, action) => {
        state.loadingSummary = false;
        state.errorSummary = action.payload;
      })
      .addCase(fetchSuggestions.pending, (state) => {
        state.loadingSuggestions = true;
        state.errorSuggestions = null;
      })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
        state.loadingSuggestions = false;
      })
      .addCase(fetchSuggestions.rejected, (state, action) => {
        state.loadingSuggestions = false;
        state.errorSuggestions = action.payload;
      })
      .addCase(checkGrammar.pending, (state) => {
        state.loadingGrammar = true;
        state.errorGrammar = null;
      })
      .addCase(checkGrammar.fulfilled, (state, action) => {
        state.grammarScore = action.payload;
        state.loadingGrammar = false;
      })
      .addCase(checkGrammar.rejected, (state, action) => {
        state.loadingGrammar = false;
        state.errorGrammar = action.payload;
      });
  },
});

export const { setEditorField, resetEditor, setActiveTab } =
  editorSlice.actions;
export default editorSlice.reducer;
