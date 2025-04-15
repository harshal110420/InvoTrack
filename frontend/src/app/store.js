import { configureStore } from "@reduxjs/toolkit";
import permissionReducer from "../features/permissions/permissionSlice";
import rolesReducer from "../features/Roles/rolesSlice";
import roleFormReducer from "../features/Roles/roleFormSlice"; 

export const store = configureStore({
  reducer: {
    permission: permissionReducer,
    roles: rolesReducer, 
    roleForm: roleFormReducer,

  },
});
