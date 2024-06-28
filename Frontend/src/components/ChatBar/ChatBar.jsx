import React, { useEffect, useState } from 'react'

function ChatBar({setOpenedChatTab,socket}) {
  const [chat,setChat]=useState([]);
  const [message,setMessage]=useState("")
  const handleSubmit=(e)=>{
     e.preventDefault();
     if(message.trim!==""){
      socket.emit("message",{message});
      console.log(chat);
      setChat((prevChat) => [...prevChat, { message, name: "you" }]);
      setMessage("");
     }
  }
  useEffect(()=>{
    socket.on("messageResponse",(data)=>{
      console.log("inside chatbar.jsx",data);
      setChat((prevChat) => [...prevChat, data]);
    })
  },[])
  return (
    <div
    className=" p-1 top-0  text-white bg-slate-900 h-[75vh]"
   
  >
    <button
      type="button"
      className="border-2 border-blue-700 w-full mt-5 rounded-2xl px-2  bg-white text-black hover:shadow"
      onClick={()=>setOpenedChatTab(false)}
    >
      {" "}
      CLOSE
    </button>
    <div className='h-96  flex-col '>

    <div className="w-full p-2 h-3/5 mt-3
  border-2 border-white rounded-lg">
    {
      chat.map((msg,index)=>(
        <p key={index*999} className='my-2 text-center w-100 text-white' >
          {msg.name}:{msg.message}
        </p>
      ))
    }
    </div>
    <form onSubmit={handleSubmit} className='p-2 mt-2 border-2 border-white rounded-lg flex flex-row justify-between'>
        <input  type="text" placeholder='Enter Your Message ' className=' bg-transparent w-full outline-none 'value={message} onChange={(e)=>{
          setMessage(e.target.value)
        }} />
        <button type='submit' className='border-2 w-24 rounded-lg bg-zinc-800'> Send</button>
    </form>
  </div>
    </div>
  )
}

export default ChatBar