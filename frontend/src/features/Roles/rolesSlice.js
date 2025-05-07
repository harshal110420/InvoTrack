import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance"; // ✅ Adjust this path if needed

// 🔹 Async thunk to fetch all roles
export const fetchRoles = createAsyncThunk(
  "roles/fetchRoles",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/roles/all");
      console.log("🔁 API raw response for roles slice: ", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Unknown error" }
      );
    }
  }
);

// 🔹 Slice definition
const roleSlice = createSlice({
  name: "roles",
  initialState: {
    roles: [],
    loading: false,
    error: null,
  },
  reducers: {
    // ✅ Add role / update / delete reducers here if needed in future
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        // console.log("🛠️ Roles data received:", action.payload); // Check the action payload
        state.loading = false;
        state.roles = action.payload?.roles || []; // ✅ Pick the roles array from response
      })

      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      });
  },
});

export default roleSlice.reducer;
