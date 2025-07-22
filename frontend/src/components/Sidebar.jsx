import React from "react";
import { forwardRef } from "react";
import { useEffect } from "react";
const Sidebar = forwardRef((props, ref) => {
  const { sidebarusers, selecteduser, onlineUsers, setselecteduser } = props;
return (
    <div id="sidebarcomp" ref={ref} className="md:w-80 w-40 h-full bg-base-200 text-white border-r border-white/10 md:pl-4 pl-1 pb-4 pr-2 pt-4 flex flex-col">
  <h2 className="text-xl font-semibold mb-4">Messages</h2>
  <div className="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-neutral-800">
    {sidebarusers?.length > 0 ? (
      sidebarusers.map((user) => {
        const isSelected = selecteduser?._id === user._id;
        return (
          <div
            key={user._id}
            onClick={() => {
              setselecteduser(null);
              setselecteduser(user);
              if (window.innerWidth <= 768 && ref?.current) {
ref.current.classList.add("hidden");
                  }
            }}
            className={`flex items-center gap-3 md:p-2 p-1 rounded-lg cursor-pointer transition ${
              isSelected ? "bg-neutral-800" : "hover:bg-neutral-800"
            }`}
          >
          <div className="relative">

            <img
  src={user.profilepic || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
  alt={user.name}
  className="w-10 h-10 min-w-10 min-h-10 rounded-full object-cover border border-white/20 aspect-square"
/>

            {onlineUsers.includes(user._id) && (
    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-black"></span>
    )}</div>            <div className="md:text-sm text-[12px] font-medium">{user.name}</div>

          </div>
        );
      })
    ) : (
      <p className="text-gray-400 text-sm">No users found.</p>
    )}
  </div>
</div>

  );
});

export default Sidebar;
