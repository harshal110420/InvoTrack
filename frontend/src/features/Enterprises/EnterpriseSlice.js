import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// ✅ Fetch all enterprises
export const fetchEnterprises = createAsyncThunk(
  "enterprise/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/enterprise/all");
      return res.data.enterprises;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch enterprises"
      );
    }
  }
);

// ✅ Create enterprise
export const createEnterprise = createAsyncThunk(
  "enterprise/create",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/enterprise/create", data);
      return res.data.enterprise;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Creation failed"
      );
    }
  }
);

export const updateEnterprise = createAsyncThunk(
  "enterprise/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/enterprise/update/${id}`, data);
      return res.data.enterprise;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Update failed"
      );
    }
  }
);

// ✅ Delete enterprise
export const deleteEnterprise = createAsyncThunk(
  "enterprise/delete",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/enterprise/delete/${id}`);
      return id; // Return the ID of the deleted enterprise
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Delete failed"
      );
    }
  }
);

// ✅ Get enterprise by ID
export const getEnterpriseById = createAsyncThunk(
  "enterprise/getById",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/enterprise/get/${id}`);
      return res.data.enterprise;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Not found"
      );
    }
  }
);

// ✅ Get children by parent ID
export const getEnterprisesByParent = createAsyncThunk(
  "enterprise/getByParent",
  async (parentId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/enterprise/by-parent/${parentId}`);
      return res.data.enterprises;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Parent lookup failed"
      );
    }
  }
);

// ✅ Get full enterprise tree
export const getEnterpriseTree = createAsyncThunk(
  "enterprise/getTree",
  async (enterpriseId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/enterprise/tree/${enterpriseId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Tree fetch failed"
      );
    }
  }
);

const enterpriseSlice = createSlice({
  name: "enterprise",
  initialState: {
    enterpriseList: [],
    selectedEnterprise: null,
    childrenEnterprises: [],
    enterpriseTree: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedEnterprise: (state) => {
      state.selectedEnterprise = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchEnterprises.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnterprises.fulfilled, (state, action) => {
        state.loading = false;
        state.enterpriseList = action.payload;
      })
      .addCase(fetchEnterprises.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createEnterprise.fulfilled, (state, action) => {
        state.enterpriseList.push(action.payload);
      })
      .addCase(createEnterprise.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update
      .addCase(updateEnterprise.fulfilled, (state, action) => {
        const idx = state.enterpriseList.findIndex(
          (ent) => ent._id === action.payload._id
        );
        if (idx !== -1) {
          state.enterpriseList[idx] = action.payload;
        }
      })
      .addCase(updateEnterprise.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteEnterprise.fulfilled, (state, action) => {
        state.enterpriseList = state.enterpriseList.filter(
          (ent) => ent._id !== action.payload
        );
      })
      .addCase(deleteEnterprise.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Get by ID
      .addCase(getEnterpriseById.fulfilled, (state, action) => {
        state.selectedEnterprise = action.payload;
      })
      .addCase(getEnterpriseById.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Children by Parent
      .addCase(getEnterprisesByParent.fulfilled, (state, action) => {
        state.childrenEnterprises = action.payload;
      })
      .addCase(getEnterprisesByParent.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Full Tree
      .addCase(getEnterpriseTree.fulfilled, (state, action) => {
        state.enterpriseTree = action.payload;
      })
      .addCase(getEnterpriseTree.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearSelectedEnterprise } = enterpriseSlice.actions;
export default enterpriseSlice.reducer;
