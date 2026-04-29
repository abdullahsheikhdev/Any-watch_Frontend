"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";
import { Movie } from "@/@types/movieslist";
import { deleteImageAction } from "@/app/actions/deleteAction";


export default function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [availableMovies, setAvailableMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const fetchMovies = async () => {
    try {
      const response = await axiosInstance.get("/api/admin/all-movis");
      if (response.data.success) {
        const comingSoonMovies = response.data.data.filter(
        (movie: Movie) => movie.status === 'coming_soon'
      );
      setMovies(comingSoonMovies)
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error("Failed to fetch movies");
    } finally {
      setLoading(false);
    }
  };
  const fetchAvailableMovies = async () => {
    try {
      const response = await axiosInstance.get("/api/admin/all-movis");
      if (response.data.success) {
        const available = response.data.data.filter(
          (movie: Movie) => movie.status === 'available'
        );
        setAvailableMovies(available);
      }
    } catch (error) {
      console.error("Error fetching available movies:", error);
      toast.error("Failed to fetch available movies");
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
    fetchMovies();
    fetchAvailableMovies();
  }, []);

const handleUpdateStatus = async (id: string, status: "coming_soon" | "available") => {
  try {
    const response = await axiosInstance.patch(`/api/admin/update-status/${id}`, { status });
    
    if (response.data.success) {
      toast.success(`Status updated to ${status.replace("_", " ")}`);

      if (status === 'available') {
        // Move from 'movies' (coming soon) to 'availableMovies'
        const movieToMove = movies.find((m) => m._id === id);
        if (movieToMove) {
          setMovies((prev) => prev.filter((m) => m._id !== id));
          setAvailableMovies((prev) => [...prev, { ...movieToMove, status }]);
        }
      } else if (status === 'coming_soon') {
        // Move from 'availableMovies' to 'movies' (coming soon)
        const movieToMove = availableMovies.find((m) => m._id === id);
        if (movieToMove) {
          setAvailableMovies((prev) => prev.filter((m) => m._id !== id));
          setMovies((prev) => [...prev, { ...movieToMove, status }]);
        }
      }

      setOpenDropdownId(null);
    }
  } catch (error) {
    console.error("Update status error:", error);
    toast.error("Failed to update status");
  }
};



const handleDelete = async (id: string, fileId?: string) => {
  if (!confirm("Are you sure you want to delete this movie?")) return;

  try {
    if (fileId) {
      const ikResponse = await deleteImageAction(fileId);
      if (!ikResponse.success) {
        console.error("ImageKit delete failed:", ikResponse.error);
      } else {
        console.log("Image deleted from ImageKit successfully");
      }
    }

    const response = await axiosInstance.delete(`/api/admin/delete-movie/${id}`);
    
    if (response.data.success) {
      toast.success("Movie and image deleted successfully");
      
      // স্টেট আপডেট
      setMovies((prev) => prev.filter((movie) => movie._id !== id));
      setAvailableMovies((prev) => prev.filter((movie) => movie._id !== id));
    }
  } catch (error) {
    console.error("Delete error:", error);
    toast.error("Failed to delete movie");
  }
};



  const formatDate = (date: string | number) => {
    if (!date) return "N/A";

    if (typeof date === "number" || (typeof date === "string" && date.length === 4 && !isNaN(Number(date)))) {
      return date.toString();
    }
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const renderStars = (rating: string) => {
    const r = parseFloat(rating);
    const fullStars = Math.min(Math.floor(r / 2), 5);
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-3 h-3 ${i < fullStars ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0a0b1e] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  

  return (
    <div className="min-h-screen bg-[#0a0b1e] text-white p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-wider uppercase">Movie List</h1>
        </div>
      <div className="p-5">
        <h4 className="text-xl mb-5">Up Coming movies List</h4>
        <div className="bg-[#121432] rounded-2xl border border-gray-800 shadow-2xl">
          <div className="">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                  <th className="px-6 py-6">Poster</th>
                  <th className="px-6 py-6">Movie Title</th>
                  <th className="px-6 py-6">Genre</th>
                  <th className="px-6 py-6">Rating</th>
                  <th className="px-6 py-6 text-center">Release Date</th>
                  <th className="px-6 py-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {movies.map((movie) => (
                  <tr key={movie._id} className="group hover:bg-[#1a1c40] transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="relative w-22 h-28 rounded-lg overflow-hidden border border-gray-700 shadow-lg">
                        <Image
                          src={movie.posterUrl || "/placeholder-movie.jpg"}
                          alt={movie.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm md:text-base text-gray-200">{movie.title}</span>
                        <span className="text-[10px] text-gray-500 font-mono uppercase">ID: {movie._id.slice(-8)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {String(movie.catagory).split(",").map((cat, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded border border-gray-700 bg-[#1a1c40] text-[10px] font-bold uppercase tracking-wider text-gray-400"
                          >
                            {cat.trim()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-yellow-500">{movie.rating}</span>
                        {renderStars(movie.rating)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-300 font-medium">
                        {formatDate(movie.releaseDate)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-3">
                        {/* Edit Dropdown */}
                        <div className="relative">
                          <button
                            onClick={() => setOpenDropdownId(openDropdownId === movie._id ? null : movie._id)}
                            className="p-2 rounded-full bg-[#1a1c40] hover:bg-blue-600 transition-colors group/btn"
                          >
                            <svg className="w-4 h-4 text-gray-400 group-hover/btn:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          
                          {openDropdownId === movie._id && (
                            <div className="absolute right-0 mt-2 w-40 bg-[#1e204a] border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                              <button
                                onClick={() => handleUpdateStatus(movie._id, "coming_soon")}
                                className={`w-full px-4 py-2 text-left text-xs font-bold hover:bg-blue-600 transition-colors ${movie.status === "coming_soon" ? "text-blue-400" : "text-gray-300"}`}
                              >
                                Coming Soon
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(movie._id, "available")}
                                className={`w-full px-4 py-2 text-left text-xs font-bold hover:bg-blue-600 transition-colors ${movie.status === "available" ? "text-blue-400" : "text-gray-300"}`}
                              >
                                Available
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(movie._id)}
                          className="p-2 rounded-full bg-[#1a1c40] hover:bg-red-600 transition-colors group/del"
                        >
                          <svg className="w-4 h-4 text-gray-400 group-hover/del:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {movies.length === 0 && !loading && (
            <div className="py-20 text-center">
              <p className="text-gray-500 font-bold uppercase tracking-widest">No movies found</p>
            </div>
          )}
        </div>
      </div>


      <div className="p-5">
        <h4 className="text-xl mb-5">Available movies List</h4>
        <div className="bg-[#121432] rounded-2xl border border-gray-800 shadow-2xl">
          <div className="">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                  <th className="px-6 py-6">Poster</th>
                  <th className="px-6 py-6">Movie Title</th>
                  <th className="px-6 py-6">Genre</th>
                  <th className="px-6 py-6">Rating</th>
                  <th className="px-6 py-6 text-center">Release Date</th>
                  <th className="px-6 py-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {availableMovies.map((movie) => (
                  <tr key={movie._id} className="group hover:bg-[#1a1c40] transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="relative w-22 h-28 rounded-lg overflow-hidden border border-gray-700 shadow-lg">
                        <Image
                          src={movie.posterUrl || "/placeholder-movie.jpg"}
                          alt={movie.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm md:text-base text-gray-200">{movie.title}</span>
                        <span className="text-[10px] text-gray-500 font-mono uppercase">ID: {movie._id.slice(-8)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {String(movie.catagory).split(",").map((cat, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded border border-gray-700 bg-[#1a1c40] text-[10px] font-bold uppercase tracking-wider text-gray-400"
                          >
                            {cat.trim()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-yellow-500">{movie.rating}</span>
                        {renderStars(movie.rating)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-300 font-medium">
                        {formatDate(movie.releaseDate)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-3">

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(movie._id)}
                          className="p-2 rounded-full bg-[#1a1c40] hover:bg-red-600 transition-colors group/del"
                        >
                          <svg className="w-4 h-4 text-gray-400 group-hover/del:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {availableMovies.length === 0 && !loading && (
            <div className="py-20 text-center">
              <p className="text-gray-500 font-bold uppercase tracking-widest">No movies found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}