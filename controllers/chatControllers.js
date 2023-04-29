const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

//create a new chat or access a chat with a user

const createNewChat = asyncHandler(async (req, res) => {
  console.log(req.user.id);

  const { userId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error("Please select a user to create a chat");
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  if (isChat.length > 0) {
    console.log(isChat[0]);
    res.send(isChat[0]);
    return;
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
  }
  try {
    const createChat = await Chat.create(chatData);

    const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
      "users",
      "-password"
    );

    res.status(200).json(fullChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//fetch all chats for a user
const fetchChats = asyncHandler(async (req, res) => {
  try {
    const allChats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .sort({ updatedAt: -1 });

    res.status(200).json(allChats);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

//create a group chat including the admin user

const createGroupChat = asyncHandler(async (req, res) => {
  const { users, name } = req.body;
  if (!users || !name) {
    res.status(400);
    throw new Error("provide details to make a group chat");
  }

  users.push(req.user._id);

  try {
    const newGroupChat = await Chat.create({
      chatName: name,
      users: users,
      groupAdmin: req.user,
      isGroupChat: true,
    });

    const fullGroupChat = await Chat.findOne({
      _id: newGroupChat._id,
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//add a user to the group chat

const addUserToGroupChat = asyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;

  if (!userId || !chatId) {
    res.status(400);
    throw new Error("Please provide a valid user to add to the group");
  }

  const groupUpdated = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!groupUpdated) {
    res.status(404);
    throw new Error("Chat not found");
  } else {
    res.json(groupUpdated);
  }
});

//remove user from group chat

const removeUserFromGroupChat = asyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;

  if (!userId || !chatId) {
    res.status(400);
    throw new Error("Please provide a valid user to add to the group");
  }

  const groupUpdated = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!groupUpdated) {
    res.status(404);
    throw new Error("Chat not found");
  } else {
    res.json(groupUpdated);
  }
});

module.exports = {
  createNewChat,
  fetchChats,
  createGroupChat,
  addUserToGroupChat,
  removeUserFromGroupChat,
};
