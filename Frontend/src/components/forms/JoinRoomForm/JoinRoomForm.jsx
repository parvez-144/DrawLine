import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import socketContext from "../../Contexts/socketContext";
import { Cookies } from "react-cookie";
import { useEffect } from "react";
function JoinRoomForm() {
  const navigate = useNavigate();
  const data = useContext(socketContext);
  const { uuid, socket, setUser, userName } = data;
  const [roomId, setRoomId] = useState("");
  const [id, setId] = useState("");
  const cookie=new Cookies();
  useEffect(()=>{
    const token=cookie.get("token");
    setId(token);
  },[])
  const handleRoomJoin = (e) => {
    e.preventDefault();
    const roomData = {
      userName,
      roomId,
      userId: id,
      host: false,
      presenter: false,
    };
    setUser(roomData);
    localStorage.setItem('user', JSON.stringify(roomData));
    navigate(`/rooms/${roomId}`);
    // socket.emit("userJoined", roomData);
  };
  return (
    <div className=" h-screen p-10  flex justify-center bg-slate-50 pb-36 ">
      <div className="bg-white  rounded-md shadow w-1/3 p-10 mt-16 flex flex-col justify-start content-start">
      <h1 className="mt-5 text-center font-bold text-2xl">
        Join Room
      </h1>
      <form action="" className="">
        <div className=" ">
          <div className="flex flex-col p-4 mt-5">
            <label htmlFor="roomId" className="block mb-2 text-sm font-medium text-gray-900">Room Code</label>
            <input
              value={roomId}
              type="text"
              onChange={(e)=>setRoomId(e.target.value)}
              placeholder="Enter Room Code"
              className="border border-gray-300 bg-gray-50 p-2.5 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full"
            />
          </div>
         
        </div>
        <div className="mt-8 pt-5 flex justify-center content-center  ">
          <button onClick={handleRoomJoin} type="submit" className="w-full text-white bg-blue-800 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
            Join Room
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}

export default JoinRoomForm;
