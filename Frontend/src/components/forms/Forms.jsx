import React from "react";
import CreateRoomForm from "./CreateRoomform/CreateRoomForm";
import JoinRoomForm from "./JoinRoomForm/JoinRoomForm";

function Forms({uuid,socket,setUser}) {
  return (
    <div
      className="flex flex-col border-2 border-blue-700
       sm:flex-row "
    >
      <div className="flex justify-center flex-col px-3 border-blue-700 w-full  py-5 md:w-1/2 sm:border-r-2 sm:border-blue-700  ">
        <h1 className=" text-3xl pt-3 text-blue-700 font-mono">Create Room</h1>
        <CreateRoomForm uuid={uuid} socket={socket} setUser={setUser} />
      </div>
      <div className="flex justify-center flex-col   border-blue-700 py-5 px-3 w-full md:w-1/2  sm:border-none border-t-2">
        <h1 className="pt-3 font-mono text-3xl text-blue-700">Join Room</h1>
        <JoinRoomForm uuid={uuid} socket={socket} setUser={setUser}  />
      </div>
    </div>
  );
}

export default Forms;
