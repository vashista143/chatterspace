import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import NoChatSelected from '../components/NoChatSelected'
import ChatContainer from '../components/ChatContainer'

const HomePage = ({authuser, onlineUsers}) => {
const [userloading,setuserloading]=useState(null)
const [messageloading,setmessageloading]=useState(null)
const [selecteduser, setselecteduser]= useState(null)
const [messages,setmessages]=useState([])
const [sidebarusers,setsidebarusers]=useState([])
useEffect(() => {
console.log(authuser)
const getusers=async()=>{
  setuserloading(true);
  try{
    const res= await fetch(`${import.meta.env.VITE_backendurl}/api/message/users`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setsidebarusers(data)
    setuserloading(false)
  }catch(error){
    console.log(error)
  }
}
getusers();
}, [])


  return (
    <div className="h-screen flex flex-col">
  <Navbar />
  <div className="flex flex-1 bg-base-200 overflow-hidden">
    <Sidebar sidebarusers={sidebarusers} onlineUsers={onlineUsers} selecteduser={selecteduser} setselecteduser={setselecteduser}/>
    {!selecteduser ? <NoChatSelected /> : <ChatContainer onlineUsers={onlineUsers} users={sidebarusers} setmessages={setmessages} setmessageloading={setmessageloading} setselecteduser={setselecteduser} messages={messages} selecteduser={selecteduser} messageloading={messageloading} authuser={authuser} />}
  </div>
</div>

  )
}
export default HomePage
