# InvoTrack
InvoTrack - Automated Invoice &amp; Expense Tracker A smart and efficient invoice &amp; expense tracking solution for small and mid-level retailers, built using the MERN stack.

### 🔐 Role-Based Access Control (RBAC)

The application uses a modular, role-based access control system. At present, the roles and permissions are managed through a centralized static configuration file for simplicity and maintainability.

> ⚙️ "The code is currently using a static RBAC config, but it is written in a scalable structure and can be connected to dynamic database-driven role mappings in future."

This setup ensures DRY principles and clean separation of access logic. The architecture supports future enhancement of dynamic role-permission mapping through backend models and admin UI without changing frontend code.
