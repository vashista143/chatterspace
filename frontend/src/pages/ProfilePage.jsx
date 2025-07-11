import React from "react";
import { Camera, Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
const ProfilePage = ({authuser}) => {
  console.log(authuser)
  const [SelectedImage, setSelectedImage] = useState(null);
  const formattedDate = authuser?.createdAt
    ? new Date(authuser.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";
  const profileImage = SelectedImage
  ? URL.createObjectURL(SelectedImage)
  : authuser?.profilepic && authuser.profilepic !== ""
    ? authuser.profilepic
    : "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result); // base64 string
      reader.onerror = (error) => reject(error);
    });
  const updateprofile=async(file)=>{
  try {
    const base64Image = await toBase64(file);
    const response = await fetch(`${import.meta.env.VITE_backendurl}/api/auth/update-profile`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profilepic: base64Image }),
    });
    if (response.ok) {
      toast.success("profile updated successfully")
    } else {
      const errorData = await response.json();
      toast.error(errorData.message || "profile update failed");
    }
  } catch (error) {
    console.error("profile update error:", error);
    toast.error("Something went wrong. Please try again later.");
  }}
  
  
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
    <Navbar/>
      <div className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-neutral-900 text-white p-6 rounded-xl shadow-lg backdrop-blur-md border border-white/10">
        <h2 className="text-xl font-semibold text-center mb-2">Profile</h2>
        <p className="text-sm text-gray-400 text-center mb-6">Your profile information</p>

       <div className="flex justify-center mb-6">
  <div className="relative w-24 h-24">
    <img
      src={profileImage}
      alt="Profile"
      className="w-full h-full object-cover rounded-full border-2 border-white"
    />
    <label>
      <div className="absolute bottom-1 right-1 bg-yellow-400 text-black p-1 rounded-full cursor-pointer hover:bg-yellow-500">
        <Camera size={16} />
      </div>
      <input
        type="file"
        accept="image/*"
        name="image"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            setSelectedImage(file);
            updateprofile(file);
          }
        }}
      />
    </label>
  </div>
</div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Full Name</label>
            <input
              type="text"
              value={authuser.name}
              disabled
              className="w-full p-2 rounded bg-neutral-800 text-gray-400 outline-none text-sm cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Email Address</label>
            <input
              type="email"
              value={authuser.email}
              disabled
              className="w-full p-2 rounded bg-neutral-800 text-gray-400 outline-none text-sm cursor-not-allowed"
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-300 font-medium">Account Information</h3>
          </div>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">Member Since:</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Account Status:</span>
              <span className="text-green-400 font-semibold">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProfilePage;
