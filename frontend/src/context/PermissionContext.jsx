// context/PermissionContext.jsx
import { createContext, useContext } from "react";

const PermissionContext = createContext();

export const PermissionProvider = ({ module, subModule, children }) => {
  return (
    <PermissionContext.Provider value={{ module, subModule }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissionContext = () => useContext(PermissionContext);
