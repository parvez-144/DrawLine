
const setupSocketListeners = (socket, setUsers, toast) => {
    socket.on("userIsJoined", (data) => {
      if (data.success) {
        console.log("data.users", data.users);
        setUsers(data.users);
      } else {
        console.log("userJoined error");
      }
    });
  
    socket.on("allUsers", (data) => {
      setUsers(data);
    });
  
    socket.on("userJoinedMessage", (data) => {
      console.log("user joined message", data);
      toast.info(`${data} joined the room `);
    });
  
    socket.on("userLeftMessageBroadcasted", (data) => {
      console.log(`${data} left the room`);
      toast.info(`${data} left the room`);
    });
  };
  
  export default setupSocketListeners;
  