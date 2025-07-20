import React, { useState, useEffect } from 'react'
import { Link, Navigate, useNavigate } from "react-router-dom";
import {Routes, Route} from "react-router-dom"
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import SignupPage from './pages/SignupPage'
import Navbar from './components/Navbar'
import { io } from "socket.io-client";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
const App = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const navigate = useNavigate();  
  const [authuser,setauthuser]= useState(null)
  const [isloggedin,setisloggedin]=useState(false)
  const [isloading,setisloading]=useState(true);
 const checkAuth = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_backendurl}/api/auth/check`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const data = await res.json();
      setauthuser(data);
      setisloggedin(true);
      const socket = io(import.meta.env.VITE_backendurl, {
        withCredentials: true,
      });

      socket.emit("user-online", data._id);

      socket.on("online-users", (onlineIds) => {
        setOnlineUsers(onlineIds);
      });
    } else {
      setauthuser(null);
      setisloggedin(false);
      console.log("User not authenticated");
    }
  } catch (error) {
    console.error("Error checking auth:", error);
  } finally {
    setisloading(false);
  }
};
useEffect(() => {
  checkAuth();
}, []);

  if (isloading) {
    return(
      <div className="flex items-center justify-center h-screen">
          <Loader className="size-10 animate-spin" />
      </div>)
  }
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} toastOptions={{
    duration: 1000
  }} />
      <Routes>
        <Route path='/' element={authuser ? <HomePage authuser={authuser} onlineUsers={onlineUsers}/> : <Navigate to="/login" />}/>
        <Route path='/signup' element={!authuser ? <SignupPage/> : <Navigate to="/" />}/>
        <Route path='/login' element={!authuser ? <LoginPage/> : <Navigate to="/" />}/>
        <Route path='/profile' element={<ProfilePage authuser={authuser}/>}/>
        <Route path='/settings' element={authuser ?  <SettingsPage/> : <Navigate to="/login" />}/>
      </Routes>
    </div>
  )
}

export default App
