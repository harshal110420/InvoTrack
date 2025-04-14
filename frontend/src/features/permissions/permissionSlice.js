import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance"; // correct path accordingly

export const fetchPermissions = createAsyncThunk(
  "permission/fetchPermissions",
  async (roleName, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/permission/getPermission/${roleName}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Unknown error" }
      );
    }
  }
);

const permissionSlice = createSlice({
  name: "permission",
  initialState: {
    modules: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        console.log("✅ Structured Permission Payload:", action.payload);
        state.modules = action.payload; // Save directly
        state.loading = false;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default permissionSlice.reducer;
