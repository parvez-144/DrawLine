import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import socketContext from "../../Contexts/socketContext";
import { Cookies } from "react-cookie";
function CreateRoomForm() {
  
  const data=useContext(socketContext);
  
  const { uuid, socket,setUser,userName}=data;
  
  const [roomId, setRoomId] = useState(uuid());
  const [id, setId] = useState("");
  
  const navigate = useNavigate();
  const cookie=new Cookies();
  useEffect(()=>{
    const token=cookie.get("token");
    setId(token);
  },[])
  
  const handleCopy = () => {
    navigator.clipboard.writeText(roomId)
      .catch((err) => console.log('Copy failed. Please try again.'));
  };
  const handleCreateRoom = (e) => {
    e.preventDefault();
    const roomData = {
      userName,
      roomId,
      userId: id,
      host: true,
      presenter: true,
    };

    setUser(roomData);
    localStorage.setItem('user', JSON.stringify(roomData)); // Save user data to local storage
    navigate(`/rooms/${roomId}`);
    // socket.emit("userJoined", roomData);
  };
  return (
    <div className=" h-screen p-10  flex justify-center bg-slate-50 pb-36 ">
      <div className="bg-white  rounded-md shadow w-1/3 p-10 mt-16 flex flex-col justify-start content-start">
      <h1 className=" text-center font-bold text-2xl">
        Create Room
      </h1>
      <form action="" className="">
        <div className=" ">
          <div className="flex flex-col p-4 ">
            <label htmlFor="roomId" className="block mb-2 text-sm font-medium text-gray-900">Room Code</label>
            <input
              value={roomId}
              type="text"
              placeholder="Generate Room Code"
              disabled
              className="border border-gray-300 bg-gray-50 p-2.5 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full"
            />
          </div>
          <div className="flex flex-row content-center justify-center gap-9 p-4">
            <button
              onClick={() => setRoomId(uuid())}
              className=" text-white bg-blue-800 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              type="button"
            >
              Regenerate
            </button>
            <button onClick={handleCopy} type="button" className=" text-black border border-slate-300 bg-slate-100 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              Copy
            </button>
          </div>
        </div>
        <div className="pt-5 flex justify-center content-center  ">
          <button onClick={handleCreateRoom} type="submit" className="w-full text-white bg-blue-800 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
            Create Room
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}

export default CreateRoomForm;
