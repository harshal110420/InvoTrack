import { configureStore } from "@reduxjs/toolkit";
import permissionReducer from "../features/permissions/permissionSlice";
import rolesReducer from "../features/Roles/rolesSlice";
import roleFormReducer from "../features/Roles/roleFormSlice"; 
import menuReducer from "../features/menus/menuSlice"; // Assuming you have a menu slice
import modulesReducer from "../features/Modules/ModuleSlice";

export const store = configureStore({
  reducer: {
    permission: permissionReducer,
    roles: rolesReducer, 
    roleForm: roleFormReducer,
    menus: menuReducer,
    modules: modulesReducer,
  },
});
