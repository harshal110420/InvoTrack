import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// Thunks
export const fetchUsers = createAsyncThunk(
  "user/fetchAll",
  async (_, thunkAPI) => {
    console.log("🚀 Thunk fetchUsers is running"); // ✅ must log
    try {
      const res = await axiosInstance.get("/users/all");
      console.log("✅ fetch users response", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ fetch users error", err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const createUser = createAsyncThunk(
  "user/create",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/users/create", data);
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "User creation failed"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/update",
  async (formData, thunkAPI) => {
    try {
      console.log("Form data received for update:", formData);
      const { id, ...updatedData } = formData; // 🪓 _id alag karo
      const res = await axiosInstance.put(`/users/update/${id}`, updatedData);
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "User update failed"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/delete",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/users/delete/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "User deletion failed"
      );
    }
  }
);

export const getUserById = createAsyncThunk(
  "user/getById",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/users/get/${id}`);
      console.log("✅ Fetched user by ID:", res.data); // updated log
      return res.data; // changed from res.data.user
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    userList: [],
    selectedUser: null,
    loading: false,
    error: null,
    createSuccess: false,
    updateSuccess: false,
  },
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    resetUserStatus: (state) => {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.userList = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.createSuccess = true;
        state.userList.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.createSuccess = false;
        state.error = action.payload || "Failed to create user";
      })

      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.updateSuccess = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.updateSuccess = true;
        const idx = state.userList.findIndex(
          (u) => u._id === action.payload._id
        );
        if (idx !== -1) {
          state.userList[idx] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.userList = state.userList.filter((u) => u._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.error = action.payload;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearSelectedUser, resetUserStatus } = userSlice.actions;
export default userSlice.reducer;
