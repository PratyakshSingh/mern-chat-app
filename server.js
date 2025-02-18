const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./utils/connectToDb");
const userRoutes = require("./routes/userRoutes.js");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const path = require("path");
//configuring env variables
dotenv.config();

//connecting to DB
connectDB();
const app = express();

app.use(express.json());
// app.use(express.static(path.join(__dirname, 'client', 'dist')));
//
// // Handle React Routing - Send index.html for all unknown routes
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
// });

//sample api

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//---------------deployment---------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "./client/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "./client", "dist", "index.html"))
  );
} else {
app.get("/", (req, res) => {
  res.send("API is running..");
});
}

//---------------deployment---------------------

//error middleware
app.use(notFound);
app.use(errorHandler);

//listening to the server
const server = app.listen(process.env.PORT, () => {
  console.log(`App started on port ${process.env.PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://localhost:5000",
    methods: ["GET", "POST"],
    // allowedHeaders: ["my-custom-header"],
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  //joining a chat
  socket.on("join chat", (roomId) => {
    socket.join(roomId);
    console.log("connected to room " + roomId);
  });

  //typing
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  //new message
  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("user disconnected");
    socket.leave(userData._id);
  });
});
