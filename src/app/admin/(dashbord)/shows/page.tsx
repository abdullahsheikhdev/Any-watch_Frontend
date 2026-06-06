"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import axiosInstance from "@/lib/axios";
import { Movie } from "@/@types/movieslist";
import { toast } from "react-toastify";

export default function AddShows() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Show configuration states
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [hallNumber, setHallNumber] = useState("");
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchActiveMovies = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/all-movies");
        if (!isMounted) return;

        if (response.data.success) {
          const allMovies = response.data.data as Movie[];
          // Filter to show active/available movies for shows listing
          const active = allMovies.filter((movie) => movie.status === "available");
          setMovies(active);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching active movies:", error);
          toast.error("Failed to load active movies");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void Promise.resolve().then(fetchActiveMovies);

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectMovie = (movieId: string) => {
    setSelectedMovieId((prevId) => {
      const nextId = prevId === movieId ? null : movieId;
      // Reset inputs when selected movie changes or is cleared
      setDate("");
      setTime("");
      setTicketPrice("");
      setHallNumber("");
      return nextId;
    });
  };

  const handlePublishShow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMovieId) {
      toast.error("Please select a movie first");
      return;
    }
    if (!date) {
      toast.error("Please select a date for the show");
      return;
    }
    if (!time) {
      toast.error("Please select a time for the show");
      return;
    }
    if (!ticketPrice || isNaN(Number(ticketPrice)) || Number(ticketPrice) <= 0) {
      toast.error("Please enter a valid ticket price");
      return;
    }
    if (!hallNumber.trim()) {
      toast.error("Please specify a movie hall number");
      return;
    }

    setPublishing(true);
    try {
      const response = await axiosInstance.post("/api/admin/add-show", {
        movieId: selectedMovieId,
        date,
        time,
        ticketPrice: Number(ticketPrice),
        hallNumber: hallNumber.trim(),
      });

      if (response.data.success) {
        toast.success(response.data.message || "Show published successfully!");
        // Clear form state
        setDate("");
        setTime("");
        setTicketPrice("");
        setHallNumber("");
        setSelectedMovieId(null);
      } else {
        toast.error(response.data.message || "Failed to publish show");
      }
    } catch (error: any) {
      console.error("Error publishing show:", error);
      const msg = error.response?.data?.message || "Error publishing show. Please try again.";
      toast.error(msg);
    } finally {
      setPublishing(false);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0b1e] text-white p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="h-9 w-48 bg-[#1e204a] rounded animate-pulse"></div>
        </div>

        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <div className="h-7 w-56 bg-[#1e204a] rounded animate-pulse"></div>
            <div className="flex gap-2">
              <div className="h-10 w-10 bg-[#1e204a] rounded-full animate-pulse"></div>
              <div className="h-10 w-10 bg-[#1e204a] rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="flex gap-6 overflow-hidden">
            {[...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="w-48 h-72 rounded-2xl bg-[#121432]/60 border border-gray-800/80 p-3 shrink-0 flex flex-col justify-between animate-pulse"
              >
                <div className="w-full h-48 bg-[#1e204a] rounded-xl"></div>
                <div className="space-y-2 mt-3">
                  <div className="h-4 bg-[#1e204a] rounded w-3/4"></div>
                  <div className="h-3 bg-[#1e204a] rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const selectedMovie = movies.find((m) => m._id === selectedMovieId);

  return (
    <div className="min-h-screen bg-[#0a0b1e] text-white p-4 md:p-8">
      {/* Title Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400">
            Show Management
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Manage your theater schedules, timespans, and seat settings.
          </p>
        </div>
      </div>

      {/* Active Movies Selection Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6 px-1">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold tracking-wide flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
              Active Movies List
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Select a movie below to configure its showtimes.
            </p>
          </div>

          {/* Scrolling Controls */}
          {movies.length > 0 && (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => scroll("left")}
                aria-label="Scroll left"
                className="p-2.5 rounded-full bg-[#121432] border border-gray-800 text-gray-300 hover:text-white hover:bg-blue-600/30 hover:border-blue-500/50 hover:scale-105 transition-all duration-300 shadow-md active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scroll("right")}
                aria-label="Scroll right"
                className="p-2.5 rounded-full bg-[#121432] border border-gray-800 text-gray-300 hover:text-white hover:bg-blue-600/30 hover:border-blue-500/50 hover:scale-105 transition-all duration-300 shadow-md active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {movies.length === 0 ? (
          <div className="bg-[#121432]/40 rounded-2xl border border-gray-800/80 p-12 text-center shadow-inner">
            <svg className="w-12 h-12 text-gray-500 mx-auto mb-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <p className="text-gray-400 font-medium tracking-wide">No active movies available in the database.</p>
            <p className="text-xs text-gray-600 mt-1">Please change status of movie to "available" in the Movie List dashboard.</p>
          </div>
        ) : (
          /* Horizontal scroll container */
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-6 pt-2 px-1 scroll-smooth snap-x snap-mandatory scrollbar-none"
            style={{ scrollbarWidth: "none" }}
          >
            {movies.map((movie) => {
              const isSelected = selectedMovieId === movie._id;
              return (
                <div
                  key={movie._id}
                  onClick={() => handleSelectMovie(movie._id)}
                  className={`relative w-48 md:w-56 shrink-0 rounded-2xl cursor-pointer select-none snap-start overflow-hidden transition-all duration-500 ${
                    isSelected
                      ? "bg-[#161a3f] border-2 border-[#EAB308] shadow-[0_0_25px_rgba(234,179,8,0.35)] scale-[1.02]"
                      : "bg-[#121432]/60 hover:bg-[#1a1c40] border border-gray-800 hover:border-gray-600 hover:scale-[1.01] hover:shadow-xl hover:shadow-black/40"
                  }`}
                >
                  {/* Poster Image Container */}
                  <div className="relative w-full h-64 md:h-72 overflow-hidden bg-gray-900">
                    <Image
                      src={movie.posterUrl || "/placeholder-movie.jpg"}
                      alt={movie.title}
                      fill
                      className={`object-cover transition-transform duration-700 ${
                        isSelected ? "scale-105" : "hover:scale-110"
                      }`}
                    />
                    {/* Shadow Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent"></div>

                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-[#EAB308] text-black p-1.5 rounded-full shadow-lg flex items-center justify-center animate-scaleIn">
                        <svg className="w-4 h-4 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}

                    {/* Quick status badge */}
                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] font-bold uppercase tracking-wider text-yellow-400 border border-yellow-500/20 flex items-center gap-1">
                        ★ {movie.rating || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Movie Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-sm md:text-base tracking-wide line-clamp-1 text-gray-100">
                      {movie.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {String(movie.catagory)
                        .split(",")
                        .slice(0, 2)
                        .map((cat, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md border border-gray-800 bg-[#0a0b1e]/80 text-[10px] font-semibold text-gray-400 capitalize"
                          >
                            {cat.trim()}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Show scheduling options (contextual placeholder/next step depending on selected movie) */}
      {selectedMovie && (
        <div className="bg-[#121432]/40 border border-gray-800 rounded-3xl p-6 md:p-8 animate-fadeIn shadow-2xl">
          <div className="md:flex gap-8 justify-between items-start">
            <div className="flex-1">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EAB308]/15 text-[#EAB308] border border-[#EAB308]/20 tracking-wider uppercase">
                Selected Movie
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold mt-3 tracking-wide text-white">
                {selectedMovie.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs md:text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="text-[#EAB308]">★</span> {selectedMovie.rating} Rating
                </span>
                <span>•</span>
                <span>Category: {selectedMovie.catagory}</span>
                <span>•</span>
                <span>
                  Released:{" "}
                  {selectedMovie.releaseDate
                    ? new Date(selectedMovie.releaseDate).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>

              {/* Show Setup Form */}
              <form onSubmit={handlePublishShow} className="mt-8 pt-6 border-t border-gray-800/80">
                <h3 className="text-xl font-bold mb-6 text-gray-100 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#EAB308]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  Configure Show details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Date Input */}
                  <div className="space-y-2">
                    <label htmlFor="showDate" className="text-xs md:text-sm font-semibold text-gray-300 block tracking-wide uppercase">
                      Show Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="date"
                        id="showDate"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-[#0a0b1e]/60 border border-gray-800/80 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#EAB308] focus:ring-1 focus:ring-[#EAB308]/20 transition-all duration-300 text-sm scheme-dark"
                      />
                    </div>
                  </div>

                  {/* Time Input */}
                  <div className="space-y-2">
                    <label htmlFor="showTime" className="text-xs md:text-sm font-semibold text-gray-300 block tracking-wide uppercase">
                      Show Time
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <input
                        type="time"
                        id="showTime"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-[#0a0b1e]/60 border border-gray-800/80 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#EAB308] focus:ring-1 focus:ring-[#EAB308]/20 transition-all duration-300 text-sm scheme-dark"
                      />
                    </div>
                  </div>

                  {/* Ticket Price Input */}
                  <div className="space-y-2">
                    <label htmlFor="ticketPrice" className="text-xs md:text-sm font-semibold text-gray-300 block tracking-wide uppercase">
                      Ticket Price
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <span className="text-gray-500 font-semibold">$</span>
                      </div>
                      <input
                        type="number"
                        id="ticketPrice"
                        min="1"
                        step="any"
                        placeholder="0.00"
                        value={ticketPrice}
                        onChange={(e) => setTicketPrice(e.target.value)}
                        required
                        className="w-full pl-8 pr-4 py-3 bg-[#0a0b1e]/60 border border-gray-800/80 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#EAB308] focus:ring-1 focus:ring-[#EAB308]/20 transition-all duration-300 text-sm"
                      />
                    </div>
                  </div>

                  {/* Movie Hall Number Input */}
                  <div className="space-y-2">
                    <label htmlFor="hallNumber" className="text-xs md:text-sm font-semibold text-gray-300 block tracking-wide uppercase">
                      Movie Hall Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="hallNumber"
                        placeholder="e.g. Hall 1 or Premium Screen"
                        value={hallNumber}
                        onChange={(e) => setHallNumber(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-[#0a0b1e]/60 border border-gray-800/80 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#EAB308] focus:ring-1 focus:ring-[#EAB308]/20 transition-all duration-300 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-8">
                  <button
                    type="submit"
                    disabled={publishing}
                    className="px-8 py-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.5)] active:scale-95 text-white disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2.5"
                  >
                    {publishing ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        Publish Show
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMovieId(null)}
                    disabled={publishing}
                    className="px-6 py-3 rounded-xl bg-[#1e204a]/60 hover:bg-[#1e204a]/90 font-bold text-sm tracking-wider uppercase transition-all active:scale-95 text-gray-300 border border-gray-800 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            {/* Micro details panel */}
            <div className="relative w-36 h-52 hidden lg:block rounded-xl overflow-hidden border border-gray-800 shadow-xl shrink-0">
              <Image
                src={selectedMovie.posterUrl || "/placeholder-movie.jpg"}
                alt={selectedMovie.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

