import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, Settings, User } from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";
import chatterspacelogo from "../assets/chatterspacelogo.png"
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  const handleLogout = () => {
    fetch(`${import.meta.env.VITE_backendurl}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).then(() => {
      toast.success("logged out successfully")
      navigate("/login");
    
    });
  };

  return (
    <nav className="w-full bg-neutral-900/90 text-white md:px-6 px-2 py-3 flex justify-between items-center shadow-md">
      <div className="text-[25px] text-amber-300 font-bold cursor-pointer" onClick={() => navigate("/")}>
        <img src={chatterspacelogo} className="md:h-9 md:w-55 h-7 w-25" alt="chatterspace logo"/>
      </div>
      <div className="flex items-center gap-4">
        {!isAuthPage && (
          <>
            <button
              onClick={() => navigate("/profile")}
              className="md:flex  items-center gap-1 md:text-sm text-[8px] hover:text-gray-300 transition"
            >
              <User size={18} /> <p className="">Profile</p>
            </button>

            <button
              onClick={handleLogout}
              className="md:flex  items-center gap-1 md:text-sm text-[8px] hover:text-gray-300 transition"
            >
              <LogOut size={18} /> Logout
            </button>
          </>
        )}
        <button
          onClick={() => navigate("/settings")}
          className={clsx(
            "md:flex  items-center gap-1 md:text-sm text-[8px] hover:text-gray-300 transition",
            isAuthPage && "ml-auto"
          )}
        >
          <Settings size={18} /> Settings
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
