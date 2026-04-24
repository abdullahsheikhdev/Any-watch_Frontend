"use client";

import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";

export default function TopBar() {

    const handelLogout = async () => {
        const { data } = await axiosInstance.post("/api/admin/logout");
        if (data.success) {
            // Clear localStorage and cookies
            localStorage.removeItem("adminToken");
            document.cookie = "adminToken=; path=/; max-age=0";
            toast.success("Logout successful");
            window.location.href = "/admin/login";
        } else {
            toast.error("Logout failed");
        }
    }

    return (
        <div className="flex justify-between items-center bg-[#020617] px-2 md:px-10 py-4 border-b border-gray-700">
            <h1 className="text-xl md:text-3xl font-bold text-gray-400"><span className='text-2xl md:text-5xl text-[#EAB308]'>A</span>ny Watch</h1>
            <button onClick={handelLogout} className="bg-[#FFD165] text-black font-semibold h-10 w-20 cursor-pointer px-1 py-0.5 md:px-4 md:py-2 rounded-lg hover:bg-[#D3C5AC] transition">Logout</button>
        </div>
    )
}