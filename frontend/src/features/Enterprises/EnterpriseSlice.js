import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// Async Thunks for CRUD operations and enterprise hierarchy
export const fetchEnterprises = createAsyncThunk(
  "enterprise/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/enterprise/all");
      console.log("Enterprises fetched:", res.data.enterprises);
      return res.data.enterprises;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch enterprises"
      );
    }
  }
);

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
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(
        `/enterprise/update/${id}`,
        updatedData
      );
      return res.data.enterprise;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Update failed"
      );
    }
  }
);

export const deleteEnterprise = createAsyncThunk(
  "enterprise/delete",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/enterprise/delete/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Delete failed"
      );
    }
  }
);

export const getEnterpriseById = createAsyncThunk(
  "enterprise/getById",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/enterprise/get/${id}`);
      console.log("Enterprise fetched by ID:", res.data.enterprise);
      return res.data.enterprise;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Not found"
      );
    }
  }
);

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
    createSuccess: false,
    updateSuccess: false,
  },
  reducers: {
    resetEnterpriseStatus: (state) => {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.error = null;
    },
    clearSelectedEnterprise: (state) => {
      state.selectedEnterprise = null;
    },
  },
  extraReducers: (builder) => {
    builder
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

      .addCase(createEnterprise.fulfilled, (state, action) => {
        state.loading = false;
        state.createSuccess = true;
        state.enterpriseList.push(action.payload);
      })
      .addCase(createEnterprise.rejected, (state, action) => {
        state.loading = false;
        state.createSuccess = false;
        state.error = action.payload || "Failed to create enterprise";
      })
      // 🔽 Update Menu
      .addCase(updateEnterprise.pending, (state) => {
        state.loading = true;
        state.updateSuccess = false;
      })
      .addCase(updateEnterprise.fulfilled, (state, action) => {
        state.loading = false;
        state.updateSuccess = true;
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

      .addCase(deleteEnterprise.fulfilled, (state, action) => {
        state.enterpriseList = state.enterpriseList.filter(
          (ent) => ent._id !== action.payload
        );
      })
      .addCase(deleteEnterprise.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(getEnterpriseById.fulfilled, (state, action) => {
        state.selectedEnterprise = action.payload;
      })
      .addCase(getEnterpriseById.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(getEnterprisesByParent.fulfilled, (state, action) => {
        state.childrenEnterprises = action.payload;
      })
      .addCase(getEnterprisesByParent.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(getEnterpriseTree.fulfilled, (state, action) => {
        state.enterpriseTree = action.payload;
      })
      .addCase(getEnterpriseTree.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearSelectedEnterprise, resetEnterpriseStatus } =
  enterpriseSlice.actions;
export default enterpriseSlice.reducer;
