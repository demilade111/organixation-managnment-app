const express = require("express");
const {
  getOrganisations,
  getSingleOrganisation,
  createOrganisation,
  addUserToOrganisation,
} = require("../controllers/organisationController");
const { protect } = require("../middlewear/authMiddleware");
const router = express.Router();

router.get("/", protect, getOrganisations);
router.get("/:orgId", protect, getSingleOrganisation);
router.post("/", protect, createOrganisation);
router.post("/:orgId/users", protect, addUserToOrganisation);

module.exports = router;
