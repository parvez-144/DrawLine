import React from "react";
import "./navbar.css";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import authContext from "../Contexts/authContext";
import { useNavigate } from "react-router-dom";
function Navbar() {
  const navigate=useNavigate();
  const auth = useContext(authContext);
  const { verified, userName, removeCookie, setUserName, setVerified } = auth;
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
  const Logout = () => {
    removeCookie("token");
    setUserName("");
    setVerified(false);
  };
  return (
    <>
      <nav
        style={{ background: "#0E1E2D" }}
        class=" dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-sky-950 dark:border-gray-600"
      >
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="" class="flex items-center space-x-3 rtl:space-x-reverse">
            <span class="self-center p__font text-2xl font-semibold whitespace-nowrap text-blue-600 dark:text-white">
              DrawLine
            </span>
          </a>
          <div className="flex gap-2  md:order-2  md:space-x-0 ">
            <button
            onClick={handleCreate}
              type="button"
              className="text-white bg-blue-700 w-24 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Host
            </button>
            <button
            onClick={handleJoin}
              type="button"
              className="text-white  bg-blue-700 w-24 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Join
            </button>
            {verified && (
              <>
                <button
                  onClick={Logout}
                  type="button"
                  className="text-white bg-gray-700 w-24 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Logout
                </button>

                <p className="text-white text-2xl p__font">{userName}</p>
              </>
            )}
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-sticky"
              aria-expanded="false"
            >
              <span class="sr-only">Open main menu</span>
              <svg
                class="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
            <ul
              style={{ background: "#0E1E2D" }}
              class="flex flex-col p-4 md:p-0 mt-4  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
            >
              <li>
                <NavLink
                  to={"/"}
                  className={(isActive) =>
                    "block py-2 px-3 text-white md:bg-transparent md:hover:text-blue-700  md:p-0 md:dark:text-blue-500"
                  }
                  aria-current="page"
                >
                  Home
                </NavLink>
              </li>
              {!verified && (
                <>
                  <li>
                    <NavLink
                      to="/Login"
                      className={(isActive) =>
                        "block py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                      }
                    >
                      Login
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={"/Signup"}
                      className={(isActive) =>
                        "block py-2 px-3 text-white  rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                      }
                    >
                      Signup
                    </NavLink>
                  </li>
                </>
              )}
              <li>
                <NavLink
                  to={"/contact"}
                  className={(isActive) =>
                    "block py-2 px-3 text-white  rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  }
                >
                  Contact
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/about"}
                  className={(isActive) =>
                    "block py-2 px-3 text-white  rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  }
                >
                  About
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
