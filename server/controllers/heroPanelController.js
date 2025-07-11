const HeroPanel = require("../models/HeroPanel");

const getActiveHeroPanels = async (req, res) => {
  try {
    const panels = await HeroPanel.findAll({
      where: { isActive: true },
      order: [["displayOrder", "ASC"]],
    });
    res.json(panels);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error while fetching hero panels." });
  }
};

const getAllHeroPanels = async (req, res) => {
  try {
    const panels = await HeroPanel.findAll({
      order: [["displayOrder", "ASC"]],
    });
    res.json(panels);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error while fetching hero panels." });
  }
};

const createHeroPanel = async (req, res) => {
  try {
    const newPanel = await HeroPanel.create(req.body);
    res.status(201).json(newPanel);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to create hero panel.", error: error.message });
  }
};

const updateHeroPanel = async (req, res) => {
  try {
    const panel = await HeroPanel.findByPk(req.params.id);
    if (!panel) {
      return res.status(404).json({ message: "Hero panel not found" });
    }
    const updatedPanel = await panel.update(req.body);
    res.json(updatedPanel);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to update hero panel.", error: error.message });
  }
};

const deleteHeroPanel = async (req, res) => {
  try {
    const panel = await HeroPanel.findByPk(req.params.id);
    if (!panel) {
      return res.status(404).json({ message: "Hero panel not found" });
    }
    await panel.destroy();
    res.json({ message: "Hero panel deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error while deleting hero panel." });
  }
};

module.exports = {
  getActiveHeroPanels,
  getAllHeroPanels,
  createHeroPanel,
  updateHeroPanel,
  deleteHeroPanel,
};
