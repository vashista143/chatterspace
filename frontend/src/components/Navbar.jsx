import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, Settings, User } from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";
import dotenv from "dotenv"
dotenv.config()
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
      window.location.reload();
    });
  };

  return (
    <nav className="w-full bg-neutral-900/90 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <div className="text-[25px] text-amber-300 font-bold cursor-pointer" onClick={() => navigate("/")}>
        Chatterspace
      </div>
      <div className="flex items-center gap-4">
        {!isAuthPage && (
          <>
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-1 text-sm hover:text-gray-300 transition"
            >
              <User size={18} /> Profile
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm hover:text-gray-300 transition"
            >
              <LogOut size={18} /> Logout
            </button>
          </>
        )}
        <button
          onClick={() => navigate("/settings")}
          className={clsx(
            "flex items-center gap-1 text-sm hover:text-gray-300 transition",
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
