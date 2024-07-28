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
let socketList={};
let roomIdGlobal=[], imgURLGlobal=[];

io.on("connection", (socket) => {
  console.log(`new user joind ${socket.id}`)
  socket.currentRoom=null;

  socket.on('check-user', ({ roomId, userName }) => {
    let error = false;
    // Access the set of clients in the specified room
    const clients = io.sockets.adapter.rooms.get(roomId);
  
    if (clients) {
      // Iterate over the clients in the room
      for (let client of clients) {
        if (socketList[client] && socketList[client].userName === userName) {
          error = true;
          break; // Exit loop early if username is found
        }
      }
    }
    // Emit result back to the client
    socket.emit('error-user-exist', { error });
  });

  
  socket.on("BE-join-room", ({roomId,userName}) => {
      
    console.log("userJoined",userName,roomId)
    // const { userName, roomId } = data;
    if(socket.currentRoom){
      socket.leave(socket.currentRoom)
    }
    socket.join(roomId);

    socketList[socket.id]={userName,video:true,audio:true}

    console.log(socketList)
    try {
      // Access the set of clients in the specified room
      const clients = io.sockets.adapter.rooms.get(roomId);
      if (clients) {
        const users = [];
  
        // Iterate over the clients in the room
        for (let client of clients) {
          // Add user info from socketList
          users.push({ userId: client, info: socketList[client] });
        }
  
        // Broadcast to other clients in the room
        socket.broadcast.to(roomId).emit('userIsJoined', { success: true, users });
        socket.broadcast.to(roomId).emit('FE-user-join', users);
      } else {
        // Handle case where roomId is not found or has no clients
        socket.emit('FE-error-user-exist', { err: true });
      }
    } catch (e) {
      console.error(e);
      // Emit error to all clients in the room if something goes wrong
      io.sockets.in(roomId).emit('FE-error-user-exist', { err: true });
    }
  
    socket.currentRoom=roomId;

    // const users = addUser({
    //   userName,
    //   userId,
    //   roomId,
    //   host,
    //   presenter,
    //   socketId: socket.id,y
    
    // });
    // socket.emit("userIsJoined", { success: true, users });
    socket.broadcast.to(roomId).emit("userJoinedMessage", userName);

    // socket.broadcast.to(roomId).emit("allUsers", users);

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
  
  socket.on('BE-call-user', ({ userToCall, from, signal }) => {
    io.to(userToCall).emit('FE-receive-call', {
      signal,
      from,
      info: socketList[socket.id],
    });
  });

  socket.on('BE-accept-call', ({ signal, to }) => {
    io.to(to).emit('FE-call-accepted', {
      signal,
      answerId: socket.id,
    });
  });

  socket.on('BE-send-message', ({ roomId, msg, sender }) => {
    io.sockets.in(roomId).emit('FE-receive-message', { msg, sender });
  });

  socket.on('BE-leave-room', ({ roomId, leaver }) => {
    delete socketList[socket.id];
    socket.broadcast
      .to(roomId)
      .emit('FE-user-leave', { userId: socket.id, userName: [socket.id] });
    const socketToLeave = io.sockets.sockets.get(socket.id);
    if (socketToLeave) {
      socketToLeave.leave(roomId);
    }
  });
  

  socket.on('BE-toggle-camera-audio', ({ roomId, switchTarget }) => {
    if (switchTarget === 'video') {
      socketList[socket.id].video = !socketList[socket.id].video;
    } else {
      socketList[socket.id].audio = !socketList[socket.id].audio;
    }
    socket.broadcast
      .to(roomId)
      .emit('FE-toggle-camera', { userId: socket.id, switchTarget });
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
