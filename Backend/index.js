const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser=require("cookie-parser")
const jwt=require("jsonwebtoken")
cors = require("cors");
require("dotenv").config();
const authRoute=require("./Routes/authRoute")
const { MONGO_URL, PORT,TOKEN_KEY } = process.env;
const { addUser, removeUser, getUser,getAllUsers} = require("./utils/utils");

const server = require("http").createServer(app);
mongoose.connect(MONGO_URL, {
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error(`Error connecting to MongoDB: ${err.message}`);
});

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

app.use("/", authRoute);

const { Server } = require("socket.io");
const io = new Server(server);
app.get("/", (req, res) => {
  res.send("this is mern real time white board sharing app");
});

let roomIdGlobal=[], imgURLGlobal=[];

io.on("connection", (socket) => {
  socket.currentRoom=null;
  socket.on("userJoined", (data) => {
    const { userName, userId, roomId, host, presenter } = data;
    // roomIdGlobal = roomId;
    if(socket.currentRoom){
      socket.leave(socket.currentRoom)
    }
    socket.join(roomId);
    socket.currentRoom=roomId;
    const users = addUser({
      userName,
      userId,
      roomId,
      host,
      presenter,
      socketId: socket.id,
    });
    socket.emit("userIsJoined", { success: true, users });
    socket.broadcast.to(roomId).emit("userJoinedMessage", userName);

    socket.broadcast.to(roomId).emit("allUsers", users);
    socket.broadcast.to(roomId).emit("whiteBoardDataResponse", {
      imgURL: imgURLGlobal,
    });
  });
  socket.on("message", (data) => {
    console.log(data,"at server listen on message");
    const { message,name,roomId } = data;
    const user = getUser(socket.id);
    console.log(user,"socket id",socket.id);
      socket.broadcast
        .to(roomId)
        .emit("messageResponse", { message, name: name });
   
    
  });
  socket.on("whiteboard", (data) => {
   const {canvasImage,roomId}= data;
    socket.broadcast.to(roomId).emit("whiteBoardDataResponse", {
      imgURL: canvasImage,
    });
  });
  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    if (user) {
      removeUser(socket.id);
      socket.broadcast
        .to(roomIdGlobal)
        .emit("userLeftMessageBroadcasted", user.name);
    }
  });
}); 
server.listen(PORT, () => {
  console.log(`server is listening at port  ${PORT}`);
});
