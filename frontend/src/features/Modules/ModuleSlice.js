import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// 🔽 Fetch all active modules
export const fetchModules = createAsyncThunk(
  "modules/fetchModules",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/modules/all_modules");
      return data; // This should be an array of { _id, name, isActive, orderBy }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const moduleSlice = createSlice({
  name: "modules",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchModules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModules.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchModules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch modules";
      });
  },
});

export default moduleSlice.reducer;
