"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    name: "Add Movie",
    path: "/admin/addMovie",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    name: "Movie List",
    path: "/admin/movieList",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
        />
      </svg>
    ),
  },
  {
    name: "Shows",
    path: "/admin/shows",
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <circle cx="5" cy="2" r="1" />
        <circle cx="19" cy="2" r="1" />
        <line x1="5" y1="2" x2="10.5" y2="5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="19" y1="2" x2="13.5" y2="5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        
        <mask id="tv-mask">
          <rect width="24" height="24" fill="white" />
          <rect x="3.5" y="7.5" width="11" height="13.5" rx="1.5" fill="black" />
          <rect x="16" y="7.5" width="5" height="1.5" rx="0.75" fill="black" />
          <rect x="16" y="10" width="5" height="1.5" rx="0.75" fill="black" />
          <rect x="16" y="12.5" width="5" height="1.5" rx="0.75" fill="black" />
          <rect x="16" y="15" width="5" height="1.5" rx="0.75" fill="black" />
          <circle cx="18.5" cy="18.5" r="1.5" fill="black" />
          <circle cx="18.5" cy="22" r="1.5" fill="black" />
        </mask>

        <g mask="url(#tv-mask)">
          <rect x="8.5" y="4.5" width="7" height="3" rx="1" />
          <rect x="2" y="5.5" width="20" height="18.5" rx="3" />
        </g>
        
        <line x1="17.5" y1="17.5" x2="19.5" y2="19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="17.5" y1="21" x2="19.5" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Booking List",
    path: "/admin/bookingList",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
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
