import { configureStore } from "@reduxjs/toolkit";
import permissionReducer from "../features/permissions/permissionSlice";
import rolesReducer from "../features/Roles/rolesSlice";
import roleFormReducer from "../features/Roles/roleFormSlice"; 
import menuReducer from "../features/menus/menuSlice"; // Assuming you have a menu slice

export const store = configureStore({
  reducer: {
    permission: permissionReducer,
    roles: rolesReducer, 
    roleForm: roleFormReducer,
    menus: menuReducer, // Add your menu slice here
  },
});
