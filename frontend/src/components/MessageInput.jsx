import React, { useState } from "react";
import dotenv from "dotenv"
dotenv.config()
const MessageInput = ({ selecteduser }) => {
  const [text, setText] = useState("");
  const handleSend = async () => {
    if (!text.trim()) return;
    
    try {
      const res = await fetch(`${import.meta.env.VITE_backendurl}/api/message/send/${selecteduser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      console.log("Message sent:", data);

      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="border-t border-white/10 p-3 bg-neutral-900 flex items-center gap-2">
      <input
        type="text"
        placeholder="Type your message..."
        className="flex-1 bg-neutral-800 px-4 py-2 rounded-full text-white outline-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={handleSend}
        className="bg-yellow-500 text-black px-4 py-2 rounded-full hover:bg-yellow-400"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
