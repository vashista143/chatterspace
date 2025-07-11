import React from "react";
import { useEffect } from "react";
const Sidebar = ({ sidebarusers, selecteduser, setselecteduser }) => {
    return (
    <div className="w-80 h-full bg-base-200 text-white border-r border-white/10 pl-4 pb-4 pr-2 pt-4 flex flex-col">
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
            }}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${
              isSelected ? "bg-neutral-800" : "hover:bg-neutral-800"
            }`}
          >
            <img
              src={
                user.profilepic
                  ? user.profilepic
                  : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border border-white/20"
            />
            <div className="text-sm font-medium">{user.name}</div>
          </div>
        );
      })
    ) : (
      <p className="text-gray-400 text-sm">No users found.</p>
    )}
  </div>
</div>

  );
};

export default Sidebar;
