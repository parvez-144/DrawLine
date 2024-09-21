import React, { useState, useRef, useEffect} from "react";
import WhiteBoard from "../../components/whiteboard/WhiteBoard";
import ChatBar from "../../components/ChatBar/ChatBar";
import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer } from "react-toastify";
import authContext from "../../components/Contexts/authContext";
import Lobby from "../../components/Lobby/Lobby";
import { Navigate, useNavigate } from "react-router-dom";
import {
  faCamera,
  faMicrophone,
  faDesktop,
  faRightFromBracket,
  faUsers,
  faPalette,
  faSquare,
  faSlash,
  faPencilAlt,
  faRedo,
  faRotateLeft,
  faTimes,
  faBars,
  faMessage,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import socketContext from "../../components/Contexts/socketContext";
import roomContext from "../../components/Contexts/roomContext";
import { Cookies } from "react-cookie";

function Room() {
  const authData = useContext(authContext);
  const navigate = useNavigate();
  const { verified } = authData;
  const data = useContext(roomContext);
  const socketData=useContext(socketContext)
  const {socket}=socketData
  const { users, userName } = data;
  const [tool, setTool] = useState("pencil");
  const [color, setcolor] = useState("black");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [openedUserTab, setOpenedUserTab] = useState(false);
  const [openedChatTab, setOpenedChatTab] = useState(true);
  const buttonsRef=useRef();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  console.log( socket);
  
  if (!verified) {
    navigate("/Login");
  }
  const uid = user.userId;
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    socket.emit("userJoined", user);
    return () => {
      socket.emit("userLeft", user);
    };
  }, [user]);

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
  const handleRoomLeave = () => {
    localStorage.removeItem("user")
    socket.emit("userLeft", user);
    navigate("/");
  };
  const handleToggleCamera=(e)=>{
    if(buttonsRef.current){
      buttonsRef.current.toggleCameraAudio(e);
    }
  }
  const handleMicrophone=(e)=>{
    if(buttonsRef.current){
      buttonsRef.current.toggleCameraAudio(e);
    }
  }
  const handleScreenShare=(e)=>{
    if(buttonsRef.current){
      buttonsRef.current.clickScreenSharing(e);
    }
  }
  return (
    <>
      <div className="h-screen w-full flex flex-col max-h-lvh">
        <div className="whiteBoard__head  bg-slate-50 flex flex-row justify-between p-4 px-16 border-b-2 border-b-slate-300 shadow-lg">
          <span className="text-2xl font-bold text-sky-950">DrawLine</span>
          {user && user.presenter && (
            <div className="flex flex-row justify-between  gap-6 px-16 pt-2">
              <FontAwesomeIcon
                onClick={undo}
                disabled={elements.length === 0}
                className="text-blue-900 text-2xl transition-transform duration-300 transform hover:scale-125 cursor-pointer"
                icon={faRotateLeft}
              />
              <FontAwesomeIcon
                onClick={redo}
                disabled={history.length < 1}
                className="text-blue-900 text-2xl tetransition-transform duration-300 transform hover:scale-125 cursor-pointer"
                icon={faRedo}
              />
              <FontAwesomeIcon
                onClick={handleClearCanvas}
                className="text-red-600 text-2xl transition-transform duration-300 transform hover:scale-125 cursor-pointer"
                icon={faTimes}
              />
              <FontAwesomeIcon
                className="text-blue-900 text-2xl transition-transform duration-300 transform hover:scale-125 cursor-pointer"
                icon={faBars}
              />
            </div>
          )}
        </div>
        <div className="flex flex-row w-full h-full">
          <div className="whiteBoard flex flex-row w-full h-full">
            <div className="canvas w-full h-full border-2 border-gray-300 rounded-lg shadow-md  ">
              {user && user.presenter && (
                <>
                  <div className="shapes absolute top-24  left-10 flex flex-col justify-between gap-7 bg-slate-100 p-3 border  shadow-md rounded-full z-10">
                    <div className="flex flex-col items-center">
                      <input
                        type="radio"
                        name="tool"
                        value="pencil"
                        id="pencil"
                        checked={tool === "pencil"}
                        onChange={(e) => setTool(e.target.value)}
                        className="hidden"
                      />
                      <label htmlFor="pencil" className="cursor-pointer">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full ${
                            tool === "pencil"
                              ? "bg-teal-300 text-white"
                              : "bg-gray-200 text-teal-400"
                          } hover:bg-teal-300 hover:text-white transition`}
                        >
                          <FontAwesomeIcon
                            icon={faPencilAlt}
                            className="text-xl"
                          />
                        </div>
                      </label>
                    </div>
                    <div className="flex flex-col items-center">
                      <input
                        type="radio"
                        name="tool"
                        value="line"
                        id="line"
                        checked={tool === "line"}
                        onChange={(e) => setTool(e.target.value)}
                        className="hidden"
                      />
                      <label htmlFor="line" className="cursor-pointer">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full ${
                            tool === "line"
                              ? "bg-teal-300 text-white"
                              : "bg-gray-200 text-teal-400"
                          } hover:bg-teal-300 hover:text-white transition`}
                        >
                          <FontAwesomeIcon
                            icon={faSlash}
                            className={`text-xl
                      `}
                          />
                        </div>
                      </label>
                    </div>
                    <div className="flex flex-col items-center">
                      <input
                        type="radio"
                        name="tool"
                        value="rect"
                        id="rect"
                        checked={tool === "rect"}
                        onChange={(e) => setTool(e.target.value)}
                        className="hidden"
                      />
                      <label htmlFor="rect" className="cursor-pointer">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full ${
                            tool === "rect"
                              ? "bg-teal-300 text-white"
                              : "bg-gray-200 text-teal-400"
                          } hover:bg-teal-300 hover:text-white transition`}
                        >
                          <FontAwesomeIcon
                            icon={faSquare}
                            className={`text-xl`}
                          />
                        </div>
                      </label>
                    </div>
                    <div className="flex flex-col items-center mb-4">
                      <label htmlFor="color" className="cursor-pointer">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full ${
                            tool === "color"
                              ? "bg-teal-300 text-white"
                              : "bg-gray-200 text-teal-400"
                          } hover:bg-teal-300 hover:text-white transition`}
                        >
                          <FontAwesomeIcon
                            icon={faPalette}
                            className="text-xl "
                          />
                        </div>

                        <input
                          type="color"
                          id="color"
                          name="tool"
                          value="color"
                          onChange={(e) => {
                            setcolor(e.target.value);
                            setTool("color");
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </>
              )}
            
               
              

             <WhiteBoard
                canvasRef={canvasRef}
                ctxRef={ctxRef}
                roomId={user.roomId}
                elements={elements}
                tool={tool}
                user={user}
                color={color}
                socket={socket}
                setElements={setElements}
              /> 
            </div>
          </div>
          <div className=" w-1/2 flex flex-col justify-between ">
            <div className="p-2 rounded-md m-2 h-[60%] border-2 border-gray-300">
              <Lobby ref={buttonsRef}/>
            </div>
           {openedUserTab && (
            <div className=" Chat_Users h-full">
              <div className="h-full flex flex-col text-black bg-white p-2 ">
                <div className="h-full p-2 rounded-lg border-slate-400 border-2 ">
                  <div className="flex flex-row justify-between">
                    <h1 className=" text-xl">People</h1>
                    <FontAwesomeIcon
                      className="pt-2 hover:scale-125 cursor-pointer"
                      icon={faXmark}
                      onClick={() => setOpenedUserTab(false)}
                    />
                  </div>
                  <div className=" h-full pt-5   ">
                    <h2 className=" text-xs">IN MEETING</h2>
                    <div className="mt-3  overflow-auto h-full max-h-[65vh]">
                      {users.map((usr, index) => (
                        <p key={index * 999} className="my-2 text-white">
                          {usr.name}
                          {user && user.userId === usr.userId && " (You)"}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {openedChatTab && (
            <div className="Chat_Users  h-full  ">
              <ChatBar
                setOpenedChatTab={setOpenedChatTab}
                socket={socket}
                userName={user.userName}
                roomId={user.roomId}
              />
            </div>
          )} 
        </div>
        </div>

        <div className="bg-slate-50 ">
          <section className=" p-7 gap-6 flex flex-row justify-center w-full h-full">
            <FontAwesomeIcon
              className=" text-2xl hover:scale-125 cursor-pointer"
              onClick={() => {
                setOpenedChatTab(false);
                setOpenedUserTab(true);
              }}
              icon={faUsers}
            />
            <FontAwesomeIcon
              className=" text-2xl hover:scale-125  cursor-pointer"
              onClick={() => {
                setOpenedUserTab(false);
                setOpenedChatTab(true);
              }}
              icon={faMessage}
            />
            <FontAwesomeIcon
              className=" text-2xl hover:scale-125 cursor-pointer"
               onClick={handleToggleCamera}
               data-switch='video'
              icon={faCamera}
            />
            <FontAwesomeIcon
              className=" text-2xl hover:scale-125 cursor-pointer"
              onClick={handleMicrophone}
              data-switch="audio"
              icon={faMicrophone}
            />
            <FontAwesomeIcon
             onClick={handleScreenShare}
           className=" text-2xl hover:scale-125 cursor-pointer"
              icon={faDesktop}
            />
            <FontAwesomeIcon
              onClick={handleRoomLeave}
              className=" text-2xl hover:scale-125 cursor-pointer"
              icon={faRightFromBracket}
            />
          </section>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Room;
