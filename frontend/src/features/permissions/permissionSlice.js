// src/redux/slices/permissionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// ✅ FETCH structured permissions for dashboard view (role-wise)
export const fetchPermissions = createAsyncThunk(
  "permission/fetchPermissions",
  async (roleName, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/permission/getPermission/${roleName}`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Unknown error" }
      );
    }
  }
);

// ✅ FETCH all permissions (for admin table view)
export const fetchAllPermissions = createAsyncThunk(
  "permission/fetchAllPermissions",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/permission/getAll`);
      console.log("Permissions Fetched of response data:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Unknown error" }
      );
    }
  }
);

// ✅ CREATE or UPDATE a permission
export const savePermission = createAsyncThunk(
  "permission/savePermission",
  async (permissionData, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        `/permission/create`,
        permissionData
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
    modules: [], // role-wise permissions
    allPermissions: [], // full admin table
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {
    resetPermissions: (state) => {
      state.modules = [];
      state.allPermissions = [];
      state.loading = false;
      state.saving = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔄 FETCH structured permissions (dashboard)
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.modules = action.payload;
        state.loading = false;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // 🔄 FETCH all permissions
      .addCase(fetchAllPermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPermissions.fulfilled, (state, action) => {
        console.log("✅ Permissions Fetched:", action.payload);
        state.allPermissions = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // 💾 CREATE or UPDATE a permission
      .addCase(savePermission.pending, (state) => {
        state.saving = true;
      })
      .addCase(savePermission.fulfilled, (state, action) => {
        state.saving = false;
      })
      .addCase(savePermission.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload?.message;
      });
  },
});
export const { resetPermissions } = permissionSlice.actions; // Export resetPermissions action

export default permissionSlice.reducer;
