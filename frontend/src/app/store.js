import { configureStore } from "@reduxjs/toolkit";
import permissionReducer from "../features/permissions/permissionSlice";
import rolesReducer from "../features/permissions/permissionSlice";

export const store = configureStore({
  reducer: {
    permission: permissionReducer,
    roles: rolesReducer,
  },
});
