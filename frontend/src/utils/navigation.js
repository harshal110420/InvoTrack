// src/utils/navigation.js
export const getModulePathByMenu = (menuKey, modules, menus) => {
  const menu = menus.find(
    (m) =>
      m.menuId === menuKey ||
      m.id === menuKey ||
      m.name.toLowerCase().replace(/\s+/g, "_") === menuKey
  );
  if (!menu) return "unknown-module";

  const matchedModule = modules.find((mod) => mod.name === menu.module);
  return matchedModule?.path || "unknown-module";
};
