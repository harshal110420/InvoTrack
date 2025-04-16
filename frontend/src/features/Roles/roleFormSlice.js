import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance"; // You should have a central Axios instance

// Fetch role by ID (for edit form prefill)
export const fetchRoleById = createAsyncThunk(
  "roleForm/fetchRoleById",
  async (roleId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/roles/get/${roleId}`);
      return response.data.role;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch role"
      );
    }
  }
);

// Create new role
export const createRole = createAsyncThunk(
  "roleForm/createRole",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/roles/create", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create role"
      );
    }
  }
);

// Update existing role
export const updateRole = createAsyncThunk(
  "roleForm/updateRole",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/roles/update/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update role"
      );
    }
  }
);

// Slice
const roleFormSlice = createSlice({
  name: "roleForm",
  initialState: {
    currentRole: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentRole: (state) => {
      state.currentRole = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchRoleById
      .addCase(fetchRoleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRole = action.payload;
      })
      .addCase(fetchRoleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createRole
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateRole
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentRole } = roleFormSlice.actions;

export default roleFormSlice.reducer;
