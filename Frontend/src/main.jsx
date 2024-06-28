import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from "react-router-dom"
import "react-toastify/ReactToastify.min.css"
import { createBrowserRouter,RouterProvider,Route,Router } from 'react-router-dom'
import Room from './pages/RoomPage/Room.jsx'
import Forms from './components/forms/Forms.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
