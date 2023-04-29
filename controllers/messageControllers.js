const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    res.status(400);
    throw new Error("Invalid message request");
  }

  const createMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    const newMessage = await Message.create(createMessage);

    let message = await Message.findOne({ _id: newMessage._id })
      .populate("sender", "name email")
      .populate("chat");

    message = await User.populate(message, {
      path: "chat.users",
      select: "name email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const allMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  try {
    const allMessages = await Message.find({ chat: chatId }).populate(
      "sender",
      "name email"
    );
    res.json(allMessages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages };
