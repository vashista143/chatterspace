import React, { useEffect, useState, useRef } from 'react';
import { X } from "lucide-react";
import { io } from "socket.io-client";
import dotenv from "dotenv"
dotenv.config()
const ChatContainer = ({
  setmessages,
  messages,
  setmessageloading,
  setselecteduser,
  selecteduser,
  messageloading,
  authuser
}) => {
  const [autoScroll, setAutoScroll] = useState(true);
  const messagesContainerRef = useRef(null);
  const [text, setText] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container && autoScroll && messages.length > 0) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, autoScroll]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [selecteduser]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_backendurl, {
      withCredentials: true,
    });
    socketRef.current = socket;

    setmessageloading(true);

socket.emit("join", {
  senderId: authuser._id,
  receiverId: selecteduser._id,
});

    socket.off("chat message");
    socket.off("messages seen");

    socket.on("chat message", (msg) => {
  setmessages((prev) => {
    const alreadyExists = prev.some((m) => m._id === msg._id);
    const updated = alreadyExists ? prev : [...prev, msg];
    return updated;
  });
  setmessageloading(false);
});

    socket.on("messages seen", ({ by }) => {
      setmessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.senderId === authuser._id && msg.receiverId === by
            ? { ...msg, seen: true }
            : msg
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [selecteduser]);

  useEffect(() => {
    if (!selecteduser) return;

    const unseenMessages = messages.filter(
      (msg) =>
        msg.receiverId === authuser._id &&
        msg.senderId === selecteduser._id &&
        !msg.seen
    );

    if (unseenMessages.length > 0) {
      socketRef.current.emit("mark as seen", {
        senderId: selecteduser._id,
        receiverId: authuser._id
      });
    }
  }, [messages, selecteduser]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const nearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      setAutoScroll(nearBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSend = () => {
    if (!text.trim()) return;

    const newMsg = {
      text,
      senderId: authuser._id,
      receiverId: selecteduser._id,
    };

    socketRef.current.emit("chat message", newMsg);
    setText("");
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="h-14 w-full bg-base-200 text-white flex items-center justify-between px-4 border-b border-white/10">
        <div className="ml-5 text-lg flex gap-3 font-semibold justify-center items-center">
          <img
            src={
              selecteduser.profilepic ||
              "https://cdn-icons-png.flaticon.com/512/847/847969.png"
            }
            alt={selecteduser.name}
            className="w-10 h-10 rounded-full object-cover border border-white/20"
          />
          {selecteduser?.name || "Chat"}
        </div>
        <button onClick={() => setselecteduser(null)}>
          <X size={20} className="hover:text-red-400 transition" />
        </button>
      </div>

      <ul id="messages" ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-2 text-white flex flex-col">
        {messageloading ? (
  Array.from({ length: 8 }).map((_, i) => {
    const isSender = i % 2 === 0; 
    return (
      <li
        key={i}
        className={`h-8 w-[40%] animate-pulse rounded-full ${
          isSender
            ? "bg-white/10 self-end mr-6 rounded-br-none"
            : "bg-white/10 self-start ml-6 rounded-bl-none"
        }`}
      ></li>
    );
  })
)  : (
  messages
    .filter(
      (msg) =>
        (msg.senderId === authuser._id && msg.receiverId === selecteduser._id) ||
        (msg.senderId === selecteduser._id && msg.receiverId === authuser._id)
    )
    .map((msg, index) => {
      const isSender = msg.senderId?.toString() === authuser._id?.toString();
      return (
        <li
          key={index}
          className={`px-2 py-1 rounded-xl max-w-[70%] ${
            isSender
              ? "bg-yellow-500 text-black self-end"
              : "bg-neutral-800 text-white self-start"
          }`}
        >
          <div className="flex gap-5">
            <div>{msg.text}</div>
            <div className="flex justify-end items-center gap-1 text-xs mt-1">
              <span className={`${isSender ? "text-black" : "text-gray-400"}`}>
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
              {isSender && (
                <span className={`font-medium ${msg.seen ? "text-blue-500" : "text-gray-400"}`}>
                  {msg.seen ? "✓✓" : "✓"}
                </span>
              )}
            </div>
          </div>
        </li>
      );
    })
)}

      </ul>

      <div className="border-t border-white/10 p-3 bg-base-200 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 bg-neutral-800 px-4 py-2 rounded-full text-white outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          className="bg-yellow-500 text-black px-4 py-2 rounded-full hover:bg-yellow-400"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;
