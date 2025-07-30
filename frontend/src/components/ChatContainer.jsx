import React, { useEffect, useState, useRef } from 'react';
import { X, CircleDot } from "lucide-react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import notificationSound from "../assets/notification.mp3?url";

const ChatContainer = ({
  sidebarRef,
  users,
  setmessages,
  messages,
  setmessageloading,
  setselecteduser,
  selecteduser,
  messageloading,
  authuser,
  onlineUsers
}) => {
  const audioRef = useRef(null);
  const hasLoadedInitialMessages = useRef(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const messagesContainerRef = useRef(null);
  const [text, setText] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(notificationSound);
    audioRef.current.load();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

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
    const socket = io(import.meta.env.VITE_backendurl, { withCredentials: true });
    socketRef.current = socket;
    setmessageloading(true);
    hasLoadedInitialMessages.current = false;

    socket.emit("join", {
      senderId: authuser._id,
      receiverId: selecteduser._id,
    });

    const fetchMessages = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_backendurl}/api/message/${selecteduser._id}`, {
          credentials: "include",
        });
        const data = await res.json();
        setmessages(data);
      } catch (err) {
        console.error("Failed to load messages", err);
      } finally {
        setmessageloading(false);
        hasLoadedInitialMessages.current = true;
      }
    };

    fetchMessages();

    socket.off("chat message");
    socket.off("messages seen");

    socket.on("chat message", (msg) => {
      setmessages((prev) => {
        const alreadyExists = prev.some((m) => m._id === msg._id);
        return alreadyExists ? prev : [...prev, msg];
      });

      const isIncoming = msg.receiverId === authuser._id;
      const isFromOtherUser = !selecteduser || selecteduser._id !== msg.senderId;
      const messageDate = new Date(msg.createdAt);
      const now = new Date();
      const diffInMs = now - messageDate;

      if (isIncoming && (isFromOtherUser || diffInMs < 2000)) {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch((err) => {
            console.error("Sound playback error:", err);
          });
        }

        const preview = msg.text.length > 10 ? msg.text.slice(0, 10) + "..." : msg.text;
        let fromName = "New message";
        if (selecteduser?._id === msg.senderId) {
          fromName = selecteduser.name;
        } else {
          const senderUser = users?.find((u) => u._id === msg.senderId);
          if (senderUser) fromName = senderUser.name;
        }

        toast(`${fromName}: ${preview}`);
      }
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
      (msg) => msg.receiverId === authuser._id && msg.senderId === selecteduser._id && !msg.seen
    );
    if (unseenMessages.length > 0) {
      socketRef.current.emit("mark as seen", {
        senderId: selecteduser._id,
        receiverId: authuser._id,
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
  <div className="h-screen w-full flex flex-col overflow-hidden">
    {/* Header */}
    <div className="h-14 bg-base-200 text-white flex items-center justify-between px-4 border-b border-white/10">
      <div className="flex items-center gap-2 overflow-hidden">
        <img
          src={selecteduser.profilepic || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
          alt={selecteduser.name}
          className="w-10 h-10 rounded-full object-cover border border-white/20"
        />
        <div className="flex flex-col">
          <span className="font-semibold truncate max-w-[150px]">{selecteduser?.name || "Chat"}</span>
          {onlineUsers.includes(selecteduser._id) && (
            <span className="text-green-500 text-xs flex items-center gap-1">
              <CircleDot size={12} /> Online
            </span>
          )}
        </div>
      </div>
      <button onClick={() => {
        setselecteduser(null);
        if (window.innerWidth <= 768 && sidebarRef?.current) {
          sidebarRef.current.classList.remove("hidden");
        }
      }}>
        <X size={20} className="hover:text-red-400 transition" />
      </button>
    </div>

    {/* Message area + input wrapper */}
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Message list */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-2 md:p-4 space-y-2 text-white"
      >
        <ul id="messages" className="flex flex-col space-y-2">
          {messageloading
            ? Array.from({ length: 8 }).map((_, i) => {
                const isSender = i % 2 === 0;
                return (
                  <li
                    key={i}
                    className={`h-8 w-[60%] animate-pulse rounded-full ${
                      isSender
                        ? "bg-white/10 self-end mr-4 rounded-br-none"
                        : "bg-white/10 self-start ml-4 rounded-bl-none"
                    }`}
                  ></li>
                );
              })
            : messages
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
                      className={`px-3 py-2 rounded-xl max-w-[90%] md:max-w-[70%] text-sm ${
                        isSender
                          ? "bg-yellow-500 text-black self-end"
                          : "bg-neutral-800 text-white self-start"
                      }`}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="break-words whitespace-pre-wrap">{msg.text}</div>
                        <div className="flex justify-end items-center gap-1 text-xs">
                          <span className={isSender ? "text-black" : "text-gray-400"}>
                            {(() => {
                              const createdAt = new Date(msg.createdAt);
                              const now = new Date();
                              const isToday =
                                createdAt.getDate() === now.getDate() &&
                                createdAt.getMonth() === now.getMonth() &&
                                createdAt.getFullYear() === now.getFullYear();

                              return isToday
                                ? createdAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
                                : `${createdAt.toLocaleDateString([], { day: "2-digit", month: "short" })}, ${createdAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
                            })()}
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
                })}
        </ul>
      </div>

      {/* Input section */}
      <div className="border-t border-white/10 p-2 md:p-3 bg-base-200 flex gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full bg-neutral-800 px-3 py-2 text-sm rounded-full text-white outline-none"
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
          className="bg-yellow-500 text-black px-3 md:px-4 py-2 text-sm md:text-base rounded-full hover:bg-yellow-400"
        >
          Send
        </button>
      </div>
    </div>
  </div>
);

};

export default ChatContainer;
