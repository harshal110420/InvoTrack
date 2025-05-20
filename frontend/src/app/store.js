// store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

import permissionReducer from "../features/permissions/permissionSlice";
import rolesReducer from "../features/Roles/rolesSlice";
import roleFormReducer from "../features/Roles/roleFormSlice";
import menuReducer from "../features/menus/menuSlice";
import modulesReducer from "../features/Modules/ModuleSlice";
import enterpriseReducer from "../features/Enterprises/EnterpriseSlice";
const rootReducer = combineReducers({
  permission: permissionReducer,
  roles: rolesReducer,
  roleForm: roleFormReducer,
  menus: menuReducer,
  modules: modulesReducer,
  enterprise: enterpriseReducer, 
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["permission", "roles", "menus", "modules","enterprise"], // ✅ roleForm jaise forms ka temporary state store nahi karte mostly
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
