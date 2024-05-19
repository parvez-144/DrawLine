const express = require("express");
const app = express();

const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.get("/", (req, res) => {
  res.send("this is mern real time white board sharin gapp");
});

let roomIdGlobal,imgURLGlobal;

io.on("connection", (socket) => {
  socket.on("userJoined", (data) => {
    const { name, userId, roomId, host, presenter } = data;
    roomIdGlobal=roomId;
    socket.join(roomId);
    socket.emit("userIsJoined",{success:true});
    socket.broadcast.to(roomId).emit("whiteBoardDataResponse",{
      imgURL:imgURLGlobal
    })
  });
  socket.on("whiteboard",(data)=>{
           imgURLGlobal=data;
           console.log(imgURLGlobal)
           socket.broadcast.to(roomIdGlobal).emit("whiteBoardDataResponse",{
            imgURL:data,
           })
  });
});
server.listen(3000, () => {
  console.log("server is listening at port 3000");
});
