import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export const AuthToggleTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className="relative overflow-hidden flex justify-between bg-neutral-800 rounded-full p-1 mb-6">
      <div
        className={clsx(
          "absolute top-0 left-0 h-full w-1/2 rounded-full bg-white transition-transform duration-1000 ease-in-out",
          isLogin ? "translate-x-full" : "translate-x-0"
        )}
      />

      {/* Buttons */}
      <button
        onClick={() => navigate("/signup")}
        className={clsx(
          "relative z-10 flex-1 py-2 text-sm font-semibold rounded-full transition-colors duration-1000",
          !isLogin ? "text-black" : "text-white"
        )}
      >
        Sign up
      </button>
      <button
        onClick={() => navigate("/login")}
        className={clsx(
          "relative z-10 flex-1 py-2 text-sm font-semibold rounded-full transition-colors duration-1000",
          isLogin ? "text-black" : "text-white"
        )}
      >
        Sign in
      </button>
    </div>
  );
};
