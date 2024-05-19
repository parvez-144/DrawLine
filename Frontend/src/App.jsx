import { useEffect, useState } from 'react'
import './App.css'
import CreateRoomForm from './components/forms/CreateRoomform/CreateRoomForm'
import Forms from './components/forms/Forms'
import {Route,Routes} from "react-router-dom"
import Room from './pages/RoomPage/Room'
import io from "socket.io-client"
import { useNavigate } from 'react-router-dom'


const server="http://localhost:3000";
const connectionOptions={
  "force new connection":true,
  reconnectionAttempts:"intfinity",
  timeout:10000,
  transports:["websocket"],
}

const socket=io(server,connectionOptions);

const uuid=()=>{
  let S4=()=>{
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1)
  };
  return (
    S4()+
    S4()+
    "-"+
    S4()+
    "-"+
    S4()+
    "-"+
    S4()+
    "-"+
    S4()+
    S4()+
    S4()
  )
}




function App() {
  const [user,setUser]=useState(null);
  
  useEffect(()=>{
    socket.on("userIsJoined",(data)=>{
      if(data.success){
        console.log("user Joined");
      }
      else{
        console.log("userJoined error");
      }
    })

  },[user])
 

  return (
    <>
     <Routes>
      <Route path="/" element={<Forms  uuid={uuid} socket={socket} setUser={setUser}/>}/>
      <Route path="/:roomId" element={<Room user={user} socket={socket}/>} />
     </Routes>
    </>
  )
}

export default App
