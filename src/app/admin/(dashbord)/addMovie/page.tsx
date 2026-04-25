"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { uploadImage } from "@/app/actions/uploadAction";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

const categories = [
  "Action", "Adventure", "Animation", "Comedy", "Crime", 
  "Documentary", "Drama", "Family", "Fantasy", "Horror", 
  "Music", "Mystery", "Romance", "Sci-Fi", "Thriller", 
  "War", "Western"
];

const ratings = Array.from({ length: 19 }, (_, i) => (1 + i * 0.5).toFixed(1));

export default function AddMovie() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [movieData, setMovieData] = useState({
    title: "",
    description: "",
    rating: "",
    catagory: "",
    releaseDate: "",
    posterUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMovieData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const result = await uploadImage(formData);
      if (result.success && result.url) {
        setMovieData((prev) => ({ ...prev, posterUrl: result.url as string }));
        toast.success("Poster uploaded successfully!");
      } else {
        toast.error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!movieData.title || !movieData.description || !movieData.posterUrl || !movieData.rating || !movieData.catagory || !movieData.releaseDate) {
      toast.error("Please fill all fields and upload a poster");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/api/admin/add-movie", movieData);
      if (response.data.success) {
        toast.success("Movie added successfully!");
        router.push("/admin/movieList");
      } else {
        toast.error(response.data.message || "Failed to add movie");
      }
    } catch (error: unknown) {
      console.error("Add movie error:", error);
      let errorMessage = "An error occurred";
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0F172A] text-white min-h-screen md:p-6 p-1">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">
          Add New Movie
        </h1>
        
        <div className="bg-[#1e293b] border border-gray-700/50 md:p-8 p-2 rounded-2xl shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Movie Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={movieData.title}
                  onChange={handleChange}
                  placeholder="e.g. Inception"
                  className="w-full p-3 rounded-xl bg-[#0f172a] border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  required
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Release Date
                </label>
                <input
                  type="date"
                  name="releaseDate"
                  value={movieData.releaseDate}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-[#0f172a] border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-gray-300"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={movieData.description}
                onChange={handleChange}
                placeholder="Enter movie synopsis..."
                rows={4}
                className="w-full p-3 rounded-xl bg-[#0f172a] border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Rating
                </label>
                <select
                  name="rating"
                  value={movieData.rating}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-[#0f172a] border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-gray-300 appearance-none"
                  required
                >
                  <option value="">Select Rating</option>
                  {ratings.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Category
                </label>
                <select
                  name="catagory"
                  value={movieData.catagory}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-[#0f172a] border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-gray-300 appearance-none"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Movie Poster
              </label>
              <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-xl border-2 border-dashed border-gray-700 bg-[#0f172a]/50 hover:border-blue-500/50 transition-colors cursor-pointer group relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex-1 text-center md:text-left">
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    {uploading ? "Uploading..." : "Click or drag to upload poster"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                </div>
                {movieData.posterUrl && (
                  <div className="relative w-24 h-32 rounded-lg overflow-hidden border border-gray-700 shadow-lg">
                    <Image
                      src={movieData.posterUrl}
                      alt="Poster Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || uploading}
                className="w-full py-4 rounded-xl bg-linear-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-lg shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding Movie...
                  </span>
                ) : "Add Movie"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
