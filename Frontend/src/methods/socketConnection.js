import io from "socket.io-client"
import { Cookies } from "react-cookie";
const server = "http://localhost:4000";
const cookie=new Cookies();
const token=cookie.get("token")
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "intfinity",
  timeout: 10000,
  transports: ["websocket"],
  auth:{
       token
  }
};

const socket = io(server, connectionOptions);
export default socket;