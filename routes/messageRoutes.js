const express = require("express");
const protectedRoute = require("../middlewares/authMiddleware");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageControllers");

const router = express.Router();

router.route("/").post(protectedRoute, sendMessage);
router.route("/:chatId").get(protectedRoute, allMessages);

module.exports = router;
