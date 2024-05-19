import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateRoomForm({ uuid, socket, setUser }) {
  const [roomId, setRoomId] = useState(uuid());
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const handleCreateRoom = (e) => {
    e.preventDefault();
    const roomData = {
      name,
      roomId,
      userId: uuid(),
      host: true,
      presenter: true,
    };

    setUser(roomData);
    navigate(`/${roomId}`)
    console.log(roomData);
    socket.emit("userJoined", roomData);
  };
  return (
    <form action="" className=" py-5">
      <div className="py-5 flex">
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="border-2 rounded-md border-slate-400 p-1"
        />
      </div>
      <div className="flex  flex-col md:flex-row ">
        <div className="flex ">
          <input
            value={roomId}
            type="text"
            placeholder="Generate Room Code"
            disabled
            className="border-2 rounded-md border-slate-400  p-1 "
          />
        </div>
        <div className="flex mt-2 md:mt-0">
          <button
            onClick={() => setRoomId(uuid())}
            className="ml-1 border-2 border-yellow-700 rounded-xl bg-blue-600 px-2"
            type="button"
          >
            Generate
          </button>
          <button
            type="button"
            className="ml-1 rounded-xl border-2 border-red-500 text-red-500 hover:shadow-red-600  hover:shadow px-2 "
          >
            Copy
          </button>
        </div>
      </div>
      <div className="mt-5">
        <button
          onClick={handleCreateRoom}
          type="submit"
          className=" w-full  rounded-xl border-2 border-yellow-700 bg-blue-600"
        >
          Generate Room
        </button>
      </div>
    </form>
  );
}

export default CreateRoomForm;
