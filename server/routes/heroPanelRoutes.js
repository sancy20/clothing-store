const express = require("express");
const router = express.Router();
const {
  getActiveHeroPanels,
  getAllHeroPanels,
  createHeroPanel,
  updateHeroPanel,
  deleteHeroPanel,
} = require("../controllers/heroPanelController");
const { protect, admin } = require("../middleware/authMiddleware");

// PUBLIC ROUTE for the homepage
router.get("/active", getActiveHeroPanels);

// ADMIN ROUTES
router
  .route("/")
  .get(protect, admin, getAllHeroPanels)
  .post(protect, admin, createHeroPanel);

router
  .route("/:id")
  .put(protect, admin, updateHeroPanel)
  .delete(protect, admin, deleteHeroPanel);

module.exports = router;
