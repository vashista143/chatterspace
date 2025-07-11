import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import toast from "react-hot-toast"
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthToggleTabs } from '../components/signinndupanimation';
import { useEffect } from 'react';
const SignupPage = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [otpverification,setotpverification]= useState(false)
  const [email, setEmail] = useState("");
  const otp = watch("otp");

  useEffect(() => {
  if (otp && otp.length === 6 && otp === generatedOTP) {
    setotpverification(true);
  } else {
    setotpverification(false);
  }
}, [otp, generatedOTP]);

const handleSendOtp = async () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const emailToSend = watch("email");
  if (!emailToSend) {
    toast.error("Enter a valid email first");
    return;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_backendurl}/api/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailToSend, otp }),
    });

    const result = await response.json();

    if (response.ok) {
      setGeneratedOTP(otp);
      setEmail(emailToSend);
      toast.success("OTP sent to email");
    } else {
      toast.error(result.message || "Failed to send OTP");
    }
  } catch (err) {
    console.error("OTP send error:", err);
    toast.error("Something went wrong while sending OTP");
  }
};


const onsubmit = async (data) => {
  if (!otpverification) {
    toast.error("Please verify your OTP before signing up.");
    return;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_backendurl}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const contentType = response.headers.get("Content-Type");
    const isJson = contentType && contentType.includes("application/json");

    let resData = {};
    if (isJson) {
      resData = await response.json();
    }

    if (response.ok) {
      toast.success("Account created successfully");
      setGeneratedOTP("");
      setotpverification(false);
      navigate("/login");
    } else {
      toast.error(resData?.message || "Signup failed");
    }
  } catch (err) {
    console.error("Signup error:", err);
    toast.error("Something went wrong");
  }
};



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
        <Navbar/>
        <div className="w-full h-screen flex items-center justify-center bg-black/70 px-4">
<div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 w-full max-w-[500px] shadow-lg backdrop-blur-md min-h-[440px]">
        <AuthToggleTabs/>

        <h2 className="text-xl font-semibold mb-6">Create an account</h2>
        <form onSubmit={handleSubmit(onsubmit)} >
        <div className="space-y-4">
          <div className="flex gap-3">
            <input
                type={"text"}
                {...register("name", { required: true })}
              placeholder="First name"
              className="w-2/2 p-3 bg-neutral-800 text-white rounded-lg placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
          <div className='flex gap-1'>
          <input
              {...register("email", { required: "Email required", pattern: /^\S+@\S+$/i })}
            placeholder="Enter your email"
            className="w-[95%] p-3 bg-neutral-800 text-white rounded-lg placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-white/20"
          />
          <button type='button' onClick={handleSendOtp} className='p-1 bg-neutral-800 text-white rounded-lg placeholder-gray-400 text-sm'>send otp</button>
          <input
  {...register("otp", { required: "Verify your OTP" })}
  placeholder="Enter OTP received"
  className={`w-[70%] p-3 bg-neutral-800 text-white rounded-lg placeholder-gray-400 text-sm outline-none focus:ring-2 transition
    ${otpverification ? "border-2 border-green-500" : "border border-neutral-700"}`}
/>

          </div>
          <input
                type={"password"}
                {...register("password", { required: true })}
            placeholder="*********"
            className="w-full p-3 bg-neutral-800 text-white rounded-lg placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>
        <button
           disabled={isSubmitting}
            type="submit"
            className="w-full mt-6 bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition"          >
              {isSubmitting ? "creating..." : "Create an account"}
          </button>
        </form>

        {/* <div className="flex items-center my-6">
          <hr className="flex-grow border-t border-gray-700" />
          <span className="mx-4 text-sm text-gray-400">OR SIGN IN WITH</span>
          <hr className="flex-grow border-t border-gray-700" />
        </div>

        <div className="flex gap-4">
          <button className="flex-1 flex items-center justify-center gap-2 bg-neutral-800 border border-neutral-700 p-3 rounded-lg hover:bg-neutral-700 transition">
            <span className="text-sm">Google</span>
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          By creating an account, you agree to our <span className="underline">Terms & Service</span>
        </p> */}
      </div>
    </div>
      </div>
    </div>
  );
};

export default SignupPage;
