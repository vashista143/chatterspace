import React from "react";
import Lottie from "lottie-react";
import chatAnimation from "../assets/chatterspace-animation.json";

const NoChatSelected = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-white px-8">
      <Lottie
        animationData={chatAnimation}
        loop={true}
        className="w-82 h-82"
      />
      <h2 className="text-3xl font-bold mt-4">Welcome to <span className="text-amber-300">Chatterspace</span> 🪐</h2>
      <p className="text-gray-400 mt-2 text-center max-w-md">
        Connect, communicate, and collaborate with anyone on the platform.
        <br /> Select a user from the sidebar to begin your conversation.
      </p>
    </div>
  );
};

export default NoChatSelected;
