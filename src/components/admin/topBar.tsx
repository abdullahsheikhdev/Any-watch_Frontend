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
        <div className="flex justify-between items-center bg-gray-800 px-10 py-4 border-b-2 border-gray-400">
            <h1 className="text-3xl font-bold text-white"><span className='text-5xl text-[#F84565]'>A</span>ny Watch</h1>
            <button onClick={handelLogout} className="bg-[#F84565] text-white font-semibold cursor-pointer px-4 py-2 rounded-lg hover:bg-[#e03a5a] transition">Logout</button>
        </div>
    )
}