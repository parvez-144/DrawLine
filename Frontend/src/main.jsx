import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from "react-router-dom"
import "react-toastify/ReactToastify.min.css"
import { createBrowserRouter,RouterProvider,Route,Router } from 'react-router-dom'
import Room from './pages/RoomPage/Room.jsx'
import Forms from './components/forms/Forms.jsx'
import Home from './components/Home/Home.jsx'
import Login from './components/Login/Login.jsx'
import Signup from './components/Signup/Signup.jsx'
import JoinRoomForm from './components/forms/JoinRoomForm/JoinRoomForm.jsx'
import Layout from './Layout.jsx'
import CreateRoomForm from './components/forms/CreateRoomform/CreateRoomForm.jsx'
const router=createBrowserRouter([
  {
    path:'/',
    element:<Layout/>,
    children:[
      {
        path:"",
        element:<Home/>
      },
      {
        path:"Login",
        element:<Login/>
      },
      {
        path:"Signup",
        element:<Signup/>
      },
      {
        path:"/joinroom",
        element:<JoinRoomForm/>
      },
      {
        path:"/createroom",
        element:<CreateRoomForm/>
      },
      {
        path:"/rooms/:roomId",
        element:<Room/>
      },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
