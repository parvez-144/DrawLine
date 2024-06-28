import React, { useState, useRef, useEffect } from "react";
import WhiteBoard from "../../components/whiteboard/WhiteBoard";
import ChatBar from "../../components/ChatBar/ChatBar";

function Room({ user, socket, users }) {
  const [tool, setTool] = useState("pencil");
  const [color, setcolor] = useState("black");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [openedUserTab, setOpenedUserTab] = useState(true);
  const [openedChatTab, setOpenedChatTab] = useState(true);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  useEffect(() => {
    return () => {
      socket.emit("userLeft", user);
    };
  }, []);
  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillRect = "white";
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setElements([]);
  };
  const undo = () => {
    setHistory((prevHistory) => [
      ...prevHistory,
      elements[elements.length - 1],
    ]);
    setElements((prevElements) =>
      prevElements.slice(0, prevElements.length - 1)
    );
  };
  const redo = () => {
    setElements((prevElements) => [
      ...prevElements,
      history[history.length - 1],
    ]);
    setHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1));
  };
  return (
    <div className="p-2 h-lvh bg-teal-300 flex flex-row justify-between  min-w-fit">
      <div className="mt-10  ">
        <div>
          <button
            type="button"
            className="m-5 border-2 border-blue-700 rounded-2xl px-2  bg-blue-400 hover:shadow "
            onClick={() => setOpenedUserTab(true)}
          >
            Users
          </button>
        </div>
        {openedUserTab && (
          <div
            className="h-fit  flex flex-col text-white bg-slate-900"
            style={{ width: "250px" }}
          >
            <button
              type="button"
              className="border-2 border-blue-700 w-full mt-5 rounded-2xl px-2 bg-white text-black hover:shadow"
              onClick={() => setOpenedUserTab(false)}
            >
              CLOSE
            </button>
            <div className="mt-10 h-[65vh] ">
              {users.map((usr, index) => (
                <p key={index * 999} className="my-2 text-white">
                  {usr.name}
                  {user && user.userId === usr.userId && " (You)"}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 m-5 ">
        <h1 className="text-center py-5 text-3xl font-mono">
          White Board Sharing App
          <span>[users Online: {users ? users.length : "Loading..."}]</span>
        </h1>
        {user && user.presenter && (
          <div className=" flex mt-2 mb-2 w-full justify-between">
            <div className="flex justify-center">
              <div className="flex gap-1 justify-between">
                <label htmlFor="pencil" className="mt-1">
                  Pencil
                </label>
                <input
                  selected
                  type="radio"
                  name="tool"
                  value="pencil"
                  checked={tool === "pencil"}
                  id="pencil"
                  className="mt-1"
                  onChange={(e) => setTool(e.target.value)}
                />
              </div>
              <div className="flex gap-1">
                <label htmlFor="line" className="mt-1">
                  Line
                </label>
                <input
                  selected
                  type="radio"
                  name="tool"
                  id="line"
                  checked={tool === "line"}
                  className="mt-1"
                  value="line"
                  onChange={(e) => setTool(e.target.value)}
                />
              </div>
              <div className="flex gap-1">
                <label htmlFor="rect" className="mt-1">
                  Rectangle
                </label>
                <input
                  selected
                  type="radio"
                  name="tool"
                  id="rect"
                  checked={tool === "rect"}
                  className="mt-1"
                  value="rect"
                  onChange={(e) => setTool(e.target.value)}
                />
              </div>
            </div>
            <div className="">
              <div className="flex gap-2 align-baseline justify-items-center">
                <label htmlFor="color" className="mt-1">
                  Select color
                </label>
                <input
                  type="color"
                  id="color"
                  className="mt-1"
                  onChange={(e) => setcolor(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-items-center">
              <button
                onClick={undo}
                disabled={elements.length === 0}
                className="mt-1 border-2 border-blue-700 rounded-2xl px-2 bg-blue-400 hover:shadow "
              >
                Undo
              </button>
              <button
                onClick={redo}
                disabled={history.length < 1}
                className="mt-1 border-2 border-blue-700 rounded-2xl px-2  hover:shadow "
              >
                Redo
              </button>
            </div>
            <div>
              <button
                onClick={handleClearCanvas}
                className="mt-1 border-2 border-red-700 rounded-2xl px-2 bg-red-500 hover:shadow-lg"
              >
                Clear canvas
              </button>
            </div>
          </div>
        )}
        <div className=" border-2  border-black">
          <WhiteBoard
            canvasRef={canvasRef}
            ctxRef={ctxRef}
            elements={elements}
            tool={tool}
            user={user}
            color={color}
            socket={socket}
            setElements={setElements}
          />
        </div>
      </div>
      <div className="pt-10">
        <button
          type="button"
        
          className="m-5 border-2 border-blue-700 rounded-2xl px-2  bg-blue-400 hover:shadow "
          onClick={() => setOpenedChatTab(true)}
        >
          chats
        </button>
        {openedChatTab && (
          <ChatBar setOpenedChatTab={setOpenedChatTab} socket={socket} />
        )}
      </div>
    </div>
  );
}

export default Room;
