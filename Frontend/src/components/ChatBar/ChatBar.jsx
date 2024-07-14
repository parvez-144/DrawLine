import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faXmark ,faCheckDouble} from '@fortawesome/free-solid-svg-icons';

function ChatBar({ setOpenedChatTab, socket,userName,roomId }) {
  console.log(userName)
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim !== "") {
      socket.emit("message", { message,name:userName,roomId:roomId });
      setChat((prevChat) => [...prevChat, { message, name:userName }]);
      console.log(chat);
      setMessage("");
    }
  };
  useEffect(() => {
    const handleMessageResponse = (data) => {
      setChat((prevChat) => [...prevChat, data]);
    };

    socket.on("messageResponse", handleMessageResponse);

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("messageResponse", handleMessageResponse);
    };
  }, [socket]);
  return (
    <div className=" p-2 text-black bg-white h-full ">
      <div className="h-full flex flex-col justify-between p-1 border-slate-300 rounded-lg border-2">
        <div className="flex flex-row justify-between p-1">
          <h1>Messages</h1>
          <FontAwesomeIcon onClick={()=>setOpenedChatTab(false)} className="p-2 cursor-pointer hover:scale-125" icon={faXmark}/>
        </div>
        <div
          className="w-full p-2 overflow-auto
  border-2 border-white rounded-lg "
        >
          {chat.map((msg, index) => (
            <div key={index*999} className={`flex ${msg.name==="you" ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`relative max-w-xs ${msg.name==="you" ? 'bg-green-500 text-white' : 'bg-gray-200 text-black'} p-3 rounded-lg`}>
              <p>{msg.name}</p>
              <p>{msg.message}</p>
              {msg.name===userName && (
                <div className="absolute bottom-1 right-2 text-xs text-gray-300">
                  <FontAwesomeIcon icon={faCheckDouble} />
                </div>
              )}
            </div>
          </div>
          ))}
       
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-2 px-2 mt-2 border-2 border-white rounded-lg flex flex-row justify-between items-center"
        >
          <input
            type="text"
            placeholder="Enter Your Message "
            className=" bg-transparent w-full outline-none "
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <button
            type="submit"
            className=" rounded-lg "
          >
            <FontAwesomeIcon className="hover:scale-125" icon={faPaperPlane}/>
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatBar;
