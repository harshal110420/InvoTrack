// src/config/rolePermissionsConfig.js

export const rolePermissionsConfig = {
  super_admin: {
    description: "Top-level access. Manages system configuration and users.",
    modules: {
      Enterprise: ['create', 'read', 'update', 'delete'],
      HSN: ['create', 'read', 'update', 'delete'],
      RateConfig: ['create', 'read', 'update', 'delete'],
      Roles: ['create', 'read', 'update', 'delete'],
      Users: ['create', 'read', 'update', 'delete'],
      Inventory: ['read'],
      Sales: ['read'],
    }
  },
  admin: {
    description: "Admin-level access. Handles business operations.",
    modules: {
      Inventory: ['create', 'read', 'update', 'delete'],
      Sales: ['create', 'read', 'update', 'delete'],
      Purchase: ['create', 'read', 'update', 'delete'],
      Invoices: ['create', 'read', 'update', 'delete'],
    }
  },
  manager: {
    description: "Mid-level access. Manages sales and inventory data.",
    modules: {
      Inventory: ['read', 'update'],
      Sales: ['create', 'read', 'update'],
      Invoices: ['read'],
    }
  },
  employee: {
    description: "Basic-level access. Handles operational tasks.",
    modules: {
      Sales: ['create', 'read'],
    }
  }
};
