const Menu = require("../../Model/SystemModels/MenuModel");

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

module.exports = {
  getMenusByModule,
  createMenu,
  updateMenu,
  deleteMenu,
};
