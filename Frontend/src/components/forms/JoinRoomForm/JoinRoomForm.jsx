import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function JoinRoomForm({uuid,socket,setUser}) {
  const navigate=useNavigate();

  const [roomId,setRoomId]=useState("")
  const [name,setName]=useState("")
  const handleRoomJoin=(e)=>{
    e.preventDefault();
    const roomData={
      name,
      roomId,
      userId:uuid(),
      host:false,
      presenter:false
    }
      setUser(roomData)
      navigate(`/${roomId}`)
      socket.emit("userJoined",roomData);
  }
  return (
    <form action="" className=" py-5">
    <div className="py-5 flex">
      <input
        value={name}
        onChange={(e)=>setName(e.target.value)}
        type="text "
        placeholder="Enter your name"
        className="border-2 rounded-md border-slate-400 p-1"
      />
    </div>
    <div className="flex  flex-col md:flex-row ">
      <div className="flex ">
        <input 
        value={roomId}
        onChange={(e)=>setRoomId(e.target.value)}
        type="text" placeholder="Enter Room Code" className="border-2 rounded-md border-slate-400  p-1 "/>
      </div>
     
    </div>
    <div className="mt-5">
      <button
      onClick={handleRoomJoin}
       type="submit" className=" w-full  rounded-xl border-2 border-yellow-700 bg-blue-600">
        Join Room
      </button>
    </div>
  
</form>
  )
}

export default JoinRoomForm