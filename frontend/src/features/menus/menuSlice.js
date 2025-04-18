import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance"; // correct path accordingly

// 🔽 1. Fetch Grouped Menus
export const fetchGroupedMenus = createAsyncThunk(
  "menus/fetchGroupedMenus",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/menus/all_menu");

      const flattened = [];
      Object.entries(data).forEach(([moduleName, categories]) => {
        Object.entries(categories).forEach(([category, menus]) => {
          menus.forEach(menu => {
            flattened.push({
              id: menu._id,
              name: menu.name,
              module: moduleName,
              category,
            });
          });
        });
      });

      return flattened;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 🔽 2. Create New Menu
export const createMenu = createAsyncThunk(
  "menus/createMenu",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/menus", formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 🔽 3. Update Menu
export const updateMenu = createAsyncThunk(
  "menus/updateMenu",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/menus/${id}`, updatedData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 🔽 Slice
const menusSlice = createSlice({
  name: "menus",
  initialState: {
    list: [],
    loading: false,
    error: null,
    createSuccess: false,
    updateSuccess: false,
  },
  reducers: {
    resetMenuStatus: (state) => {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      // 🔽 Fetch
      .addCase(fetchGroupedMenus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupedMenus.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchGroupedMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // 🔽 Create
      .addCase(createMenu.pending, state => {
        state.loading = true;
        state.createSuccess = false;
      })
      .addCase(createMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.createSuccess = true;
        state.list.push({
          id: action.payload._id,
          name: action.payload.name,
          module: action.payload.module?.name,
          category: action.payload.category,
        });
      })
      .addCase(createMenu.rejected, (state, action) => {
        state.loading = false;
        state.createSuccess = false;
        state.error = action.payload || "Failed to create menu";
      })

      // 🔽 Update
      .addCase(updateMenu.pending, state => {
        state.loading = true;
        state.updateSuccess = false;
      })
      .addCase(updateMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.updateSuccess = true;

        const updatedMenu = action.payload;
        const index = state.list.findIndex(menu => menu.id === updatedMenu._id);
        if (index !== -1) {
          state.list[index] = {
            id: updatedMenu._id,
            name: updatedMenu.name,
            module: updatedMenu.module?.name,
            category: updatedMenu.category,
          };
        }
      })
      .addCase(updateMenu.rejected, (state, action) => {
        state.loading = false;
        state.updateSuccess = false;
        state.error = action.payload || "Failed to update menu";
      });
  },
});

export const { resetMenuStatus } = menusSlice.actions;
export default menusSlice.reducer;
