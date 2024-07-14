import React, { useContext } from "react";
import "./Home.css";
import Features from "../features/Features";
import assets from "../../assets/assets";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import authContext from "../Contexts/authContext";

function Home() {
  const navigate = useNavigate();
  const auth=useContext(authContext);
  const {verified,userName}=auth;

  const handleCreate=()=>{
        if(verified){
            navigate("/createroom")
        } else{
          navigate('/Login')
        }
  }
  const handleJoin=()=>{
    if(verified){
        navigate("/joinroom")
    } else{
      navigate('/Login')
    }
}

  return (
    <>
    <Navbar/>
      <div className="flex flex-col">
        <div className="home-container mt-16 flex flex-row">
          <div className="content p-16 pl-24 w-[50%]">
            <h1 className="section__heading">
              FROM IDEAS TO <span className="text-blue-800">EXECUTION</span>
            </h1>
            <p className="p__opensans">
              Draw, Chat, and Stream - Unleash Your Creative Potential with
              DrawLine.Experience Real-Time Interaction with Our Whiteboard,
              Chat, and Audio Features.
            </p>
            <div className="flex flex-1 flex-row mt-5 w-[100%]">
              <button onClick={handleCreate} className="create_room mr-1">Create Room</button>
              <button onClick={handleJoin} className="join_room ml-1">Join Room</button>
            </div>
          </div>
          <div className=" img__wrapper">
            <img src={assets.MeetingImage} alt="" />
          </div>
        </div>
        <div className="info-component__wrapper ">
          <h1 className=" text-center text-4xl">Highlights</h1>
          <div className="flex flex-row justify-center p-9 ">
            <Features
              img={assets.imageof1}
              heading={"Smooth Experince"}
              paragraph={
                "Experience seamless collaboration with our intuitive and responsive DrawLine."
              }
            />
            <Features
              img={assets.imageof2}
              heading={"Free To Use"}
              paragraph={
                "Free, intuitive tool for seamless collaboration, enhancing productivity effortlessly"
              }
            />
            <Features
              img={assets.imageof3}
              heading={"Real Time"}
              paragraph={
                "DrawLine enables real-time collaboration, fostering efficiency and seamless teamwork."
              }
            />
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default Home;
