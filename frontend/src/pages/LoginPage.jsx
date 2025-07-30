import { React, useState } from 'react';
import { useEffect } from "react";
import Navbar from '../components/Navbar';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthToggleTabs } from '../components/signinndupanimation';
import toast from "react-hot-toast"
const LoginPage = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const onsubmit = async (data) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_backendurl}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data }),
    });
    if (response.ok) {
      navigate("/");
      window.location.reload();
    } else {
      const errorData = await response.json();
      toast.error(errorData.message || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    toast.error("Something went wrong. Please try again later.");
  }
  };
 const [loading, setLoading] = useState(true); // add this state

useEffect(() => {
  const checkLogin = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_backendurl}/api/auth/check`, {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const user = await res.json();
        console.log("Already logged in:", user);
        navigate("/");
      } else {
        setLoading(false); // not logged in, show login form
      }
    } catch (error) {
      console.log("Not logged in");
      setLoading(false); // allow form to show
    }
  };

  checkLogin();
}, []);
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video autoPlay muted loop playsInline className="absolute top-0 left-0 w-full h-full object-cover z-[-1]">
        <source
          src="https://cdn.dribbble.com/userupload/17384646/file/original-862fb8700f61d5b437eee4e82c46ceed.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      <div className="relative z-10 h-full">
        <Navbar />
        <div className="w-full h-screen flex items-center justify-center bg-black/70 px-4">
          <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 w-full max-w-[500px] shadow-lg backdrop-blur-md min-h-[440px]">
            <AuthToggleTabs />
            <h2 className="text-xl font-semibold mb-6">Login</h2>
            <form onSubmit={handleSubmit(onsubmit)} >
              <div className="space-y-4">
                <input
                  {...register("email", { required: "Email required", pattern: /^\S+@\S+$/i })}
                  placeholder="Enter your email"
                  className="w-full p-3 bg-neutral-800 text-white rounded-lg placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-white/20"
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", { required: true })}
                    placeholder="********"
                    className="w-full p-3 pr-10 bg-neutral-800 text-white rounded-lg placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-white/20"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512">
                        <path d="M572.52 241.4C518.31 135.5 407.49 64 288 64S57.69 135.5 3.48 241.4a48.07 48.07 0 000 29.2C57.69 376.5 168.51 448 288 448s230.31-71.5 284.52-177.4a48.07 48.07 0 000-29.2zM288 400c-97.05 0-189.05-58.6-240-144 50.95-85.4 142.95-144 240-144s189.05 58.6 240 144c-50.95 85.4-142.95 144-240 144zm0-240a96 96 0 1096 96 96.11 96.11 0 00-96-96zm0 144a48 48 0 1148-48 48.06 48.06 0 01-48 48z" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm9.4 130.3C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5l-41.9-33zM192 256c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5z" /></svg>
                    )}
                  </span>
                </div>
              </div>
              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full mt-6 bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition"          >
                {isSubmitting ? "logging in..." : "login"}
              </button>
            </form>

            <div className="flex items-center mb-2 ">
          <hr className="flex-grow border-t border-gray-700" />
          <span className="mx-4 text-sm text-gray-400 mt-2">OR SIGN IN WITH</span>
          <hr className="flex-grow border-t border-gray-700" />
        </div>

        <div className="flex gap-4">
        <button
  className="flex-1 flex items-center justify-center gap-2 bg-neutral-800 border border-neutral-700 p-3 rounded-lg hover:bg-neutral-700 transition"
  onClick={() => {
window.location.href = `${import.meta.env.VITE_backendurl}/api/auth/google`;
  }}
>
  <span className="text-sm">Google</span>
</button>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
