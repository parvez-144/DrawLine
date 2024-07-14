import { useEffect, useState } from "react";
import "./App.css";
import Forms from "./components/forms/Forms";
import { Route, Routes } from "react-router-dom";
import Room from "./pages/RoomPage/Room";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Home from "./components/Home/Home";

// const server = "http://localhost:3000";
// const connectionOptions = {
//   "force new connection": true,
//   reconnectionAttempts: "intfinity",
//   timeout: 10000,
//   transports: ["websocket"],
// };

// const socket = io(server, connectionOptions);

// const uuid = () => {
//   let S4 = () => {
//     return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
//   };
//   return (
//     S4() +
//     S4() +
//     "-" +
//     S4() +
//     "-" +
//     S4() +
//     "-" +
//     S4() +
//     "-" +
//     S4() +
//     S4() +
//     S4()
//   );
// };

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  useEffect(() => {
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
  }, []);

  // {<Forms uuid={uuid} socket={socket} setUser={setUser} />}
  return (
    <>
      <ToastContainer />

      <Routes>
        <Route path="" element={<Home />} />
        <Route
          path="/:roomId"
          element={<Room user={user} socket={socket} users={users} />}
        />
      </Routes>
    </>
  );
}

export default App;
