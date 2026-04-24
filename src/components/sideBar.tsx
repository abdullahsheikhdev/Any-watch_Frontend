"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: "Movie List",
    path: "/admin/movieList",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    ),
  },
  {
    name: "Add Movie",
    path: "/admin/addMovie",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    name: "Booking List",
    path: "/admin/bookingList",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
];

export default function SideBar() {
  const pathname = usePathname();

  return (
    <aside className="h-full bg-[#020617] text-white w-full border-r border-gray-700 shadow-xl relative">
      <div className="md:p-6 p-2">
        <h2 className="hidden md:block text-xl font-semibold text-gray-400 uppercase tracking-widest mb-8 md:px-4">
          Admin Panel
        </h2>
        <h2 className="md:hidden max-w-20 text-center font-semibold text-gray-400 uppercase tracking-widest mb-8 md:px-4">
          Admin Panel
        </h2>
        <nav className="space-y-2 hidden md:block">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? "bg-[#181202] text-[#EAB308] shadow-lg border-r-4 border-[#EAB308]"
                    : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
                }`}
              >
                <div
                  className={`transition-transform duration-300 ${
                    isActive ? "scale-110" : "group-hover:scale-110"
                  }`}
                >
                  {item.icon}
                </div>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <nav className="space-y-2 md:hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center justify-center py-2 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? "bg-[#181202] text-[#EAB308] shadow-lg border-r-4 border-[#EAB308]"
                    : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
                }`}
              >
                <div
                  className={`transition-transform duration-300 ${
                    isActive ? "scale-110" : "group-hover:scale-110"
                  }`}
                >
                  {item.icon}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
