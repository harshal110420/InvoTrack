export const rolePermissionsConfig = {
  super_admin: {
    description: "Top-level access. Manages system configuration and users.",
    modules: {
      Finance: {
        Master: {
          Accounts: ["create", "read", "update", "delete"],
        },
        Transaction: {
          Transactions: ["create", "read", "update", "delete"],
        },
        Report: {
          Reports: ["read"],
        },
      },
      Sales: {
        Master: {
          Customers: ["create", "read", "update", "delete"],
        },
        Transaction: {
          Orders: ["create", "read", "update", "delete"],
          Invoices: ["create", "read", "update", "delete"],
        },
        Report: {},
      },
      Inventory: {
        Master: {
          Products: ["create", "read", "update", "delete"],
          Suppliers: ["create", "read", "update", "delete"],
        },
        Transaction: {
          Stock: ["create", "read", "update", "delete"],
        },
        Report: {},
      },
      Users: {
        Master: {
          Management: ["create", "read", "update", "delete"],
          Roles: ["create", "read", "update", "delete"],
        },
      },
    },
  },
};
