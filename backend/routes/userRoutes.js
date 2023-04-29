const express = require("express");
const {
  registerUser,
  loginUser,
  searchUsers,
} = require("../controllers/userControllers");
const protectedRoute = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser);
router.route("/login").post(loginUser);
router.route("/").get(protectedRoute, searchUsers);

module.exports = router;
