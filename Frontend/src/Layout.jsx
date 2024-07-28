import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { useCookies } from "react-cookie";
import { useState } from "react";
import { useEffect } from "react";
import authContext from "./components/Contexts/authContext";
import socketContext from "./components/Contexts/socketContext";
import { useLocation } from "react-router-dom";
import verifyCookie from "./methods/verifyCookie";
import uuid from "./methods/uuid";
import setupSocketListeners from "./methods/socketHandler";
import socket from "./methods/socketConnection";
import { ToastContainer, toast } from "react-toastify";
import roomContext from "./components/Contexts/roomContext";

function Layout() {
  let location = useLocation();
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [cookies, removeCookie] = useCookies([]);
  const [verified, setVerified] = useState(false);
  const [users, setUsers] = useState([]);
  const [isAuthReady, setIsAuthReady] = useState(false); // New state to track when authContext is ready
  console.log(socket);
  useEffect(() => {
    setupSocketListeners(socket, setUsers, toast);
  }, []);

  useEffect(() => {
    console.log("working");
    verifyCookie(setUserName, setVerified);
    setIsAuthReady(true); // Set the state to true after the effect completes
  }, [cookies, removeCookie,location]);

  return (
    <>
      <roomContext.Provider value={{ user, socket, users, userName }}>
        <socketContext.Provider value={{ uuid, socket, setUser, userName }}>
          {isAuthReady ? (
            <authContext.Provider
              value={{
                verified,
                userName,
                removeCookie,
                setUserName,
                setVerified,
              }}
            >
              <Outlet />
            </authContext.Provider>
          ) : (
            <div>Loading...</div> // Optionally, show a loading indicator while authContext is not ready
          )}
        </socketContext.Provider>
      </roomContext.Provider>
    </>
  );
}

export default Layout;
