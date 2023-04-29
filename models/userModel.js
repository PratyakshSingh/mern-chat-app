const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a Name"],
    },
    email: {
      type: String,
      required: [true, "Please provide a email"],
      unique: [true, "This email is already registered"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    pic: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  {
    timestamps: true,
  }
);

//pre middleware to encrypt the password
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//password matching instance method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword.toString(), this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
