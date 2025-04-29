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
      console.log(
        "Permissions Fetched from fetchPermissions slice",
        response.data
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Unknown error" }
      );
    }
  }
);

// ✅ FETCH all permissions (for admin table view)
// export const fetchAllPermissions = createAsyncThunk(
//   "permission/fetchAllPermissions",
//   async (_, thunkAPI) => {
//     try {
//       const response = await axiosInstance.get(`/permission/getAll`);
//       console.log("Permissions Fetched from fetchAllPermissions slice:", response.data);
//       return response.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data || { message: "Unknown error" }
//       );
//     }
//   }
// );

// ✅ FETCH all permissions (for admin table view)
// Fetch all permissions and merge them with menus (including newly created ones with default empty actions)
export const fetchAllPermissions = createAsyncThunk(
  "permission/fetchAllPermissions",
  async (_, thunkAPI) => {
    try {
      // Fetching all permissions
      const response = await axiosInstance.get(`/permission/getAll`);
      const allPermissions = response.data;
      console.log("Permissions Fetched from fetchAllPermissions slice:", allPermissions);
      // Return the permissions as-is for now
      return allPermissions;
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
      console.log(
        "Permissions Fetched from savePermission slice:",
        response.data
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
        if (Array.isArray(action.payload)) {
          state.modules = action.payload;
        } else {
          state.modules = []; // unexpected data, better safe than sorry
        }
        state.loading = false;
      })

      .addCase(fetchPermissions.rejected, (state, action) => {
        console.warn(
          "❌ Failed to fetch permissions:",
          action.payload?.message
        );
        state.modules = []; // Safety clear
        state.loading = false;
        state.error = action.payload?.message || "Permission fetch failed.";
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
