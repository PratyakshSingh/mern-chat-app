const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const protectedRoute = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decodedToken.id).select("-password");

      next();
    } catch (error) {
      res.status(400);
      throw new Error("not authorized token failed");
      // res.json({
      //   message: error.message,
      // });
    }
  }

  if (!token) {
    res.status(400);
    throw new Error("Not authorized no token");
    // res.json({
    //   message: "Not authorized no token",
    // });
  }
});

module.exports = protectedRoute;
