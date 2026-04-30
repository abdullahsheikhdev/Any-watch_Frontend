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
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <g>
          <g>
            <path
              d="M463.774,416.384c-3.124-3.124-8.188-3.124-11.312,0l-20,20c-3.124,3.124-3.124,8.192,0,11.312
			c1.564,1.564,3.608,2.344,5.656,2.344c2.048,0,4.096-0.78,5.656-2.344l20-20C466.898,424.576,466.898,419.508,463.774,416.384z"
            />
          </g>
        </g>
        <g>
          <g>
            <path
              d="M463.774,348.384l-20-20c-3.124-3.124-8.188-3.124-11.312,0c-3.124,3.124-3.124,8.192,0,11.312l20,20
			c1.564,1.564,3.608,2.344,5.656,2.344c2.048,0,4.096-0.78,5.656-2.344C466.898,356.576,466.898,351.508,463.774,348.384z"
            />
          </g>
        </g>
        <g>
          <g>
            <path
              d="M460.118,156.02h-132c0-16-12.564-28-28-28H271.43l103.988-104c0.212,0.012,0.416,0.056,0.624,0.056
			c6.616,0,12-5.384,12-12c0-6.616-5.384-12.004-12-12.004c-6.616,0-12,5.384-12,12c0,0.216,0.056,0.416,0.064,0.624
			L256.118,120.688L148.058,12.624c0.008-0.216,0.064-0.416,0.064-0.624c0-6.616-5.384-12-12-12c-6.616,0-12,5.384-12,12
			c0,6.616,5.384,12,12,12c0.212,0,0.416-0.044,0.624-0.056l104.06,104.076h-28.688c-15.436,0-28,12-28,28h-132
			C25.722,156.02,4.01,177.6,4.01,204v260.04c0,26.4,21.712,47.98,48.108,47.98h408c26.4,0,47.892-21.58,47.892-47.98V204
			C508.01,177.6,486.518,156.02,460.118,156.02z M376.042,8.076c2.212,0,4,1.792,4,4c0,0.596-0.148,1.152-0.384,1.66
			c-0.376-1.212-1-2.36-1.96-3.316c-0.952-0.96-2.108-1.584-3.32-1.956C374.894,8.224,375.446,8.076,376.042,8.076z M134.462,10.344
			c-0.96,0.956-1.584,2.104-1.96,3.316c-0.236-0.508-0.384-1.064-0.384-1.66c0-2.208,1.788-4,4-4c0.592,0,1.148,0.152,1.664,0.388
			C136.574,8.756,135.418,9.384,134.462,10.344z M388.01,452.04c0,6.6-5.288,11.98-11.892,11.98h-312
			c-6.6,0-12.108-5.38-12.108-11.98V216c0-6.6,5.508-11.98,12.108-11.98h268.124h31.876h12c6.604,0,11.892,5.38,11.892,11.98V452.04
			z M448.118,464.04c-17.672,0-32-14.324-32-32c0-17.672,14.328-32,32-32s32,14.328,32,32
			C480.118,449.716,465.79,464.04,448.118,464.04z M448.118,376.04c-17.672,0-32-14.324-32-32c0-17.672,14.328-32,32-32
			s32,14.328,32,32C480.118,361.716,465.79,376.04,448.118,376.04z M476.118,292.02h-56c-4.42,0-8-3.584-8-8c0-4.416,3.58-8,8-8h56
			c4.416,0,8,3.584,8,8C484.118,288.436,480.534,292.02,476.118,292.02z M476.118,268.02h-56c-4.42,0-8-3.584-8-8
			c0-4.416,3.58-8,8-8h56c4.416,0,8,3.584,8,8C484.118,264.436,480.534,268.02,476.118,268.02z M476.118,244.02h-56
			c-4.42,0-8-3.584-8-8s3.58-8,8-8h56c4.416,0,8,3.584,8,8S480.534,244.02,476.118,244.02z M476.118,220.02h-56c-4.42,0-8-3.584-8-8
			s3.58-8,8-8h56c4.416,0,8,3.584,8,8S480.534,220.02,476.118,220.02z"
            />
          </g>
        </g>
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
