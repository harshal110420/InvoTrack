// src/config/rolePermissionsConfig.js

export const rolePermissionsConfig = {
  super_admin: {
    description: "Top-level access. Manages system configuration and users.",
    modules: {
      Finance: {
        Accounts: ["create", "read", "update", "delete"],
        Transactions: ["create", "read", "update", "delete"],
        Reports: ["read"],
      },
      Sales: {
        Orders: ["create", "read", "update", "delete"],
        Customers: ["create", "read", "update", "delete"],
        Invoices: ["create", "read", "update", "delete"],
      },
      Inventory: {
        Products: ["create", "read", "update", "delete"],
        Stock: ["create", "read", "update", "delete"],
        Suppliers: ["create", "read", "update", "delete"],
      },
      Users: {
        Management: ["create", "read", "update", "delete"],
        Roles: ["create", "read", "update", "delete"],
      },
    },
  },
};

