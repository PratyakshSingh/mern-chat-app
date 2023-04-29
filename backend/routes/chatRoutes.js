const express = require("express");
const {
  createNewChat,
  fetchChats,
  createGroupChat,
  addUserToGroupChat,
  removeUserFromGroupChat,
} = require("../controllers/chatControllers");
const protectedRoute = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").get(protectedRoute, fetchChats);
router.route("/newChat").post(protectedRoute, createNewChat);
router.route("/newGroupChat").post(protectedRoute, createGroupChat);
router.route("/addUser").post(protectedRoute, addUserToGroupChat);
router.route("/removeUser").post(protectedRoute, removeUserFromGroupChat);

module.exports = router;
