"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";

interface PopulatedMovie {
  _id: string;
  title: string;
  posterUrl: string;
  catagory: string;
  rating: string;
  releaseDate: string | number;
  status: string;
}

interface Show {
  _id: string;
  movieId: PopulatedMovie | null | string;
  date: string;
  time: string;
  ticketPrice: number;
  hallNumber: string;
}

export default function Dashbord() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit modal states
  const [editingShow, setEditingShow] = useState<Show | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editTicketPrice, setEditTicketPrice] = useState("");
  const [editHallNumber, setEditHallNumber] = useState("");
  const [updating, setUpdating] = useState(false);

  // Fetch active shows
  const fetchShows = async () => {
    try {
      const response = await axiosInstance.get("/api/admin/all-shows");
      if (response.data.success) {
        setShows(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching shows:", error);
      toast.error("Failed to load active shows");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchShows();
  }, []);

  // Delete show handler
  const handleDeleteShow = async (showId: string) => {
    if (!window.confirm("Are you sure you want to delete this show from the schedule?")) {
      return;
    }

    try {
      const response = await axiosInstance.delete(`/api/admin/delete-show/${showId}`);
      if (response.data.success) {
        toast.success("Show deleted successfully");
        // Remove from local state
        setShows((prev) => prev.filter((s) => s._id !== showId));
      } else {
        toast.error(response.data.message || "Failed to delete show");
      }
    } catch (error: any) {
      console.error("Error deleting show:", error);
      const msg = error.response?.data?.message || "Failed to delete show";
      toast.error(msg);
    }
  };

  // Open edit modal
  const handleOpenEdit = (show: Show) => {
    setEditingShow(show);
    setEditDate(show.date || "");
    setEditTime(show.time || "");
    setEditTicketPrice(show.ticketPrice?.toString() || "");
    setEditHallNumber(show.hallNumber || "");
  };

  // Update show submit handler
  const handleUpdateShow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShow) return;

    if (!editDate || !editTime || !editTicketPrice || !editHallNumber.trim()) {
      toast.error("All fields are required");
      return;
    }

    if (isNaN(Number(editTicketPrice)) || Number(editTicketPrice) <= 0) {
      toast.error("Please enter a valid ticket price");
      return;
    }

    setUpdating(true);
    try {
      const response = await axiosInstance.put(`/api/admin/edit-show/${editingShow._id}`, {
        date: editDate,
        time: editTime,
        ticketPrice: Number(editTicketPrice),
        hallNumber: editHallNumber.trim(),
      });

      if (response.data.success) {
        toast.success("Show updated successfully");
        // Update local state
        setShows((prev) =>
          prev.map((s) => (s._id === editingShow._id ? response.data.data : s))
        );
        // Close modal
        setEditingShow(null);
      } else {
        toast.error(response.data.message || "Failed to update show");
      }
    } catch (error: any) {
      console.error("Error updating show:", error);
      const msg = error.response?.data?.message || "Failed to update show";
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-[#0F172A] text-white min-h-screen p-6 pb-20">
      <h1 className="text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
        Dashbord
      </h1>

      {/* Analytics stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <div className="flex justify-between items-center p-5 rounded-2xl bg-[#141c38]/60 border border-gray-800/80 shadow-lg hover:border-gray-700/80 transition-all">
          <div>
            <h2 className="text-sm font-semibold text-gray-400 tracking-wide uppercase">Total Revenue</h2>
            <p className="text-3xl font-bold mt-2">$1,234</p>
          </div>
          <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-500/20 text-blue-400 flex items-center justify-center w-12 h-12">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="flex justify-between items-center p-5 rounded-2xl bg-[#141c38]/60 border border-gray-800/80 shadow-lg hover:border-gray-700/80 transition-all">
          <div>
            <h2 className="text-sm font-semibold text-gray-400 tracking-wide uppercase">Tickets Sold</h2>
            <p className="text-3xl font-bold mt-2">482</p>
          </div>
          <div className="p-3 bg-emerald-600/10 rounded-xl border border-emerald-500/20 text-emerald-400 flex items-center justify-center w-12 h-12">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
        </div>

        <div className="flex justify-between items-center p-5 rounded-2xl bg-[#141c38]/60 border border-gray-800/80 shadow-lg hover:border-gray-700/80 transition-all">
          <div>
            <h2 className="text-sm font-semibold text-gray-400 tracking-wide uppercase">Active Shows</h2>
            <p className="text-3xl font-bold mt-2">{shows.length}</p>
          </div>
          <div className="p-3 bg-yellow-600/10 rounded-xl border border-yellow-500/20 text-yellow-400 flex items-center justify-center w-12 h-12">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
        </div>

        <div className="flex justify-between items-center p-5 rounded-2xl bg-[#141c38]/60 border border-gray-800/80 shadow-lg hover:border-gray-700/80 transition-all">
          <div>
            <h2 className="text-sm font-semibold text-gray-400 tracking-wide uppercase">Total Movies</h2>
            <p className="text-3xl font-bold mt-2">12</p>
          </div>
          <div className="p-3 bg-purple-600/10 rounded-xl border border-purple-500/20 text-purple-400 flex items-center justify-center w-12 h-12">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Shows Manager Grid */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-wide flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse"></span>
              Active Shows
            </h2>
            <p className="text-xs md:text-sm text-gray-400 mt-1">
              Currently running and scheduled movie shows in all theaters.
            </p>
          </div>
        </div>

        {loading ? (
          /* Pulse Skeleton Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-[#121432]/40 border border-gray-800/80 p-4 shrink-0 flex flex-col justify-between animate-pulse h-96"
              >
                <div className="w-full h-56 bg-[#141c38] rounded-xl"></div>
                <div className="space-y-3 mt-4 flex-1">
                  <div className="h-5 bg-[#141c38] rounded w-3/4"></div>
                  <div className="h-4 bg-[#141c38] rounded w-1/2"></div>
                  <div className="h-4 bg-[#141c38] rounded w-2/3"></div>
                </div>
                <div className="flex gap-2.5 mt-4">
                  <div className="h-10 bg-[#141c38] rounded-lg flex-1"></div>
                  <div className="h-10 bg-[#141c38] rounded-lg flex-1"></div>
                </div>
              </div>
            ))}
          </div>
        ) : shows.length === 0 ? (
          <div className="bg-[#121432]/20 rounded-2xl border border-gray-800/80 p-12 text-center shadow-inner">
            <svg className="w-12 h-12 text-gray-600 mx-auto mb-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <p className="text-gray-400 font-medium tracking-wide">No active shows scheduled at the moment.</p>
            <p className="text-xs text-gray-600 mt-1.5">
              Go to Show Management to configure showtimes for available movies.
            </p>
          </div>
        ) : (
          /* Active Shows Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {shows.map((show) => {
              const movie = show.movieId && typeof show.movieId === "object" ? show.movieId : null;
              return (
                <div
                  key={show._id}
                  className="group relative rounded-2xl bg-[#121432]/40 hover:bg-[#121432]/70 border border-gray-800/80 hover:border-gray-700/80 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-black/50 hover:scale-[1.01]"
                >
                  {/* Poster Image */}
                  <div className="relative w-full h-56 bg-gray-900 overflow-hidden">
                    <Image
                      src={(movie && movie.posterUrl) || "/placeholder-movie.jpg"}
                      alt={(movie && movie.title) || "Movie poster"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121432] via-[#121432]/30 to-transparent"></div>

                    {/* Price Tag */}
                    <div className="absolute top-3 right-3 bg-blue-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg border border-blue-500/30">
                      ${show.ticketPrice}
                    </div>

                    {/* Hall number badge */}
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-[#EAB308] border border-[#EAB308]/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      {show.hallNumber}
                    </div>
                  </div>

                  {/* Show Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base md:text-lg line-clamp-1 text-white tracking-wide group-hover:text-yellow-400 transition-colors">
                        {(movie && movie.title) || "Unknown Movie"}
                      </h3>
                      {movie && (
                        <p className="text-xs text-gray-500 mt-1 uppercase font-semibold tracking-wider">
                          {movie.catagory}
                        </p>
                      )}

                      {/* Showtime Info */}
                      <div className="mt-4 space-y-2 border-t border-gray-800/80 pt-3">
                        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-300">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{show.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-300">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{show.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2.5 mt-5 pt-3 border-t border-gray-800/80">
                      <button
                        onClick={() => handleOpenEdit(show)}
                        className="flex-1 py-2 rounded-lg bg-blue-600/10 hover:bg-blue-600 border border-blue-500/20 hover:border-blue-500 text-blue-400 hover:text-white font-bold text-xs tracking-wider uppercase transition-all duration-300 active:scale-95 text-center flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteShow(show._id)}
                        className="flex-1 py-2 rounded-lg bg-red-600/10 hover:bg-red-600 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white font-bold text-xs tracking-wider uppercase transition-all duration-300 active:scale-95 text-center flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Show Modal */}
      {editingShow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#121432] border border-gray-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative animate-scaleIn">
            {/* Close button */}
            <button
              onClick={() => setEditingShow(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Title */}
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
              Edit Showtime Details
            </h2>
            <p className="text-xs md:text-sm text-gray-400 mb-6">
              Modify showtime parameters for{" "}
              <span className="font-semibold text-yellow-400">
                {(editingShow.movieId &&
                  typeof editingShow.movieId === "object" &&
                  editingShow.movieId.title) ||
                  "this show"}
              </span>.
            </p>

            {/* Modal Form */}
            <form onSubmit={handleUpdateShow} className="space-y-5">
              {/* Date Input */}
              <div className="space-y-1.5">
                <label htmlFor="editShowDate" className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
                  Show Date
                </label>
                <input
                  type="date"
                  id="editShowDate"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#0a0b1e]/60 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#EAB308] focus:ring-1 focus:ring-[#EAB308]/20 transition-all text-sm [color-scheme:dark]"
                />
              </div>

              {/* Time Input */}
              <div className="space-y-1.5">
                <label htmlFor="editShowTime" className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
                  Show Time
                </label>
                <input
                  type="time"
                  id="editShowTime"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#0a0b1e]/60 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#EAB308] focus:ring-1 focus:ring-[#EAB308]/20 transition-all text-sm [color-scheme:dark]"
                />
              </div>

              {/* Ticket Price */}
              <div className="space-y-1.5">
                <label htmlFor="editTicketPrice" className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
                  Ticket Price ($)
                </label>
                <input
                  type="number"
                  id="editTicketPrice"
                  min="1"
                  step="any"
                  value={editTicketPrice}
                  onChange={(e) => setEditTicketPrice(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#0a0b1e]/60 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#EAB308] focus:ring-1 focus:ring-[#EAB308]/20 transition-all text-sm"
                />
              </div>

              {/* Hall Number */}
              <div className="space-y-1.5">
                <label htmlFor="editHallNumber" className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
                  Movie Hall Number
                </label>
                <input
                  type="text"
                  id="editHallNumber"
                  value={editHallNumber}
                  onChange={(e) => setEditHallNumber(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#0a0b1e]/60 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#EAB308] focus:ring-1 focus:ring-[#EAB308]/20 transition-all text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-800/80 mt-6">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold text-sm tracking-wider uppercase transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer text-white"
                >
                  {updating ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingShow(null)}
                  disabled={updating}
                  className="px-6 py-3 rounded-xl bg-[#1e204a]/60 hover:bg-[#1e204a]/90 font-bold text-sm tracking-wider uppercase transition-all active:scale-95 text-gray-300 border border-gray-800 disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
