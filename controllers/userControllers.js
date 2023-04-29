const User = require("../models/userModel");
// const { cloudinary } = require("../utils/cloudinaryUtil");
const generateToken = require("../utils/generateToken");

//register controller
const registerUser = async (req, res) => {
  try {
    const { name, email, pic, password } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please enter all the fields");
    }

    //checking if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    //creating a new User
    const user = await User.create({
      name: name,
      email: email,
      password: password,
      pic: pic,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

//login controller
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(401);
      throw new Error("Email or password cannot be empty");
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid Email or password");
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

//search users from the db
const searchUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword).select("name email pic");

  res.send(users);
};

module.exports = { registerUser, loginUser, searchUsers };
