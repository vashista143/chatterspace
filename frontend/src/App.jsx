import React, { useState, useEffect } from 'react'
import { Link, Navigate, useNavigate } from "react-router-dom";
import {Routes, Route} from "react-router-dom"
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import Navbar from './components/Navbar.jsx'
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const navigate = useNavigate();  
  const [authuser,setauthuser]= useState(null)
  const [isloggedin,setisloggedin]=useState(false)
  const [isloading,setisloading]=useState(true);
  useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/check", {
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
        <Route path='/' element={authuser ? <HomePage authuser={authuser}/> : <Navigate to="/login" />}/>
        <Route path='/signup' element={!authuser ? <SignupPage/> : <Navigate to="/" />}/>
        <Route path='/login' element={!authuser ? <LoginPage/> : <Navigate to="/" />}/>
        <Route path='/profile' element={<ProfilePage authuser={authuser}/>}/>
        <Route path='/settings' element={authuser ?  <SettingsPage/> : <Navigate to="/login" />}/>
      </Routes>
    </div>
  )
}

export default App
