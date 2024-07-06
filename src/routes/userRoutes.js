const express = require("express");
const { getUserRecord } = require("../controllers/userController");
const { protect } = require("../middlewear/authMiddleware");

const router = express.Router();

router.get("/:id", protect, getUserRecord);

module.exports = router;
