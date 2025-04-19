const Menu = require("../../Model/SystemModels/MenuModel");
const Module = require("../../Model/SystemModels/ModuleModel");

const getAllMenusGrouped = async (req, res) => {
  try {
    const menus = await Menu.find().populate("moduleId");

    const grouped = {};

    menus.forEach((menu) => {
      const moduleName = menu.moduleId.name; // from populated field
      const category = menu.type || "Uncategorized";

      if (!grouped[moduleName]) {
        grouped[moduleName] = {};
      }

      if (!grouped[moduleName][category]) {
        grouped[moduleName][category] = [];
      }

      grouped[moduleName][category].push({
        _id: menu._id,
        name: menu.name,
        path: menu.path,
        actions: menu.actions, // optional: view/create/edit/delete etc.
      });
    });

    res.json(grouped);
  } catch (err) {
    console.error("Error in getAllMenusGrouped:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get all menus for a module
const getMenusByModule = async (req, res) => {
  try {
    const menus = await Menu.find({ moduleId: req.params.moduleId }); // ✅ Correct param name
    res.json(menus);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Create a new menu
const createMenu = async (req, res) => {
  try {
    const newMenu = new Menu(req.body);
    await newMenu.save();
    res.status(201).json(newMenu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Update menu
const updateMenu = async (req, res) => {
  try {
    const updatedMenu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedMenu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete menu
const deleteMenu = async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: "Menu deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get single menu by ID
const getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id).populate("moduleId");

    if (!menu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    res.json(menu);
  } catch (err) {
    console.error("Error in getMenuById:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllMenusGrouped,
  getMenusByModule,
  createMenu,
  updateMenu,
  deleteMenu,
  getMenuById
};
