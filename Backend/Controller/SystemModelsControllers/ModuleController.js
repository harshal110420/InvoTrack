const Module = require("../../Model/SystemModels/ModuleModel");

// ✅ Get all modules
const getAllModules = async (req, res) => {
  try {
    const modules = await Module.find({ isActive: true }).sort({ orderBy: 1 });
    res.json(modules);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Create a new module
const createModule = async (req, res) => {
  try {
    const newModule = new Module(req.body);
    await newModule.save();
    res.status(201).json(newModule);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Update module
const updateModule = async (req, res) => {
  try {
    const updatedModule = await Module.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedModule);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete module
const deleteModule = async (req, res) => {
  try {
    await Module.findByIdAndDelete(req.params.id);
    res.json({ message: "Module deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllModules,
  createModule,
  updateModule,
  deleteModule,
};
