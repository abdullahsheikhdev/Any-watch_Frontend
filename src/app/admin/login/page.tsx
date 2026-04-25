"use client";

import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function AdminLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axiosInstance.post("/api/admin/login", {
        email,
        password,
      });

      if (data.token) {
        // Save to localStorage for axios interceptor
        localStorage.setItem("adminToken", data.token);
        // Note: adminToken is handled by the backend HttpOnly cookie
        
        toast.success("Login successful");
        router.push("/admin");
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "An error occurred during login";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center loginLiner from-blue-50 to-indigo-100 px-4">
      <div className="bg-[#0F172A] p-8 rounded-xl shadow-lg w-full max-w-md">
        <div>
          <h2 className="text-4xl text-[#FFD165] font-bold mb-6 text-center">Admin Login</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 ">

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#D3C5AC] mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`w-full px-4 py-3 border text-[#D3C5AC] border-[#D3C5AC] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
              placeholder="Enter your email"
            />
          </div>

            {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#D3C5AC] mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className={`w-full px-4 py-3 border text-[#D3C5AC] border-[#D3C5AC] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-12`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#FFD165] text-black py-3 rounded-lg hover:bg-[#D3C5AC] transition font-medium disabled:bg-[#D3C5AC] disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
