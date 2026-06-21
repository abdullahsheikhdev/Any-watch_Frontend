'use client'

import React, { useState, useEffect } from 'react'
import axiosInstance from '@/lib/axios'
import Link from 'next/link'
import Image from 'next/image'

interface Movie {
  _id: string
  title: string
  description: string
  posterUrl: string
  rating: string
  catagory: any // Can be object, array, or string in the DB
  status: 'available' | 'coming_soon'
  releaseDate?: string
}


export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await axiosInstance.get('/api/user/movies')
        if (data.success && Array.isArray(data.movies) && data.movies.length > 0) {
          setMovies(data.movies)
        }
      } catch (error) {
        console.error('Failed to fetch movies from API, using fallback data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMovies()
  }, [])

  // Helper to parse categories cleanly
  const renderCategories = (cat: any) => {
    if (Array.isArray(cat)) return cat.slice(0, 3)
    if (typeof cat === 'object' && cat !== null) {
      return Object.values(cat).slice(0, 3)
    }
    if (typeof cat === 'string') {
      try {
        const parsed = JSON.parse(cat)
        if (Array.isArray(parsed)) return parsed.slice(0, 3)
        if (typeof parsed === 'object') return Object.values(parsed).slice(0, 3)
      } catch {
        return cat.split(',').map(s => s.trim()).slice(0, 3)
      }
    }
    return []
  }

  // Filter & sort available movies (top 4 by rating)
  const availableMovies = movies
    .filter(m => m.status === 'available')
    .sort((a, b) => parseFloat(b.rating || '0') - parseFloat(a.rating || '0'))
    .slice(0, 4)

  // Filter & sort coming soon movies (top 4 by rating)
  const comingSoonMovies = movies
    .filter(m => m.status === 'coming_soon')
    .sort((a, b) => parseFloat(b.rating || '0') - parseFloat(a.rating || '0'))
    .slice(0, 4)

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans pb-16">
      {/* Hero Banner */}
      <section className="relative w-full h-[60vh] md:h-[70vh] bg-cover bg-center flex items-center justify-center overflow-hidden" style={{ backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.6), rgba(17, 24, 39, 0.95)), url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80')` }}>
        <div className="max-w-7xl mx-auto px-4 text-center z-10 space-y-6 animate-fade-in">
          <span className="text-sm font-semibold tracking-widest text-[#F84565] uppercase bg-[#F84565]/10 px-3 py-1 rounded-full border border-[#F84565]/35">
            Introducing Any Watch
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white">
            Discover Your Next <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-[#F84565]">Favorite Movie</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-300">
            Book seats online, track coming soon blockbusters, and get immersive movie experiences at your fingertips.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a href="#now-showing" id="btn-explore" className="px-8 py-3 bg-[#F84565] hover:bg-[#d83550] text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5">
              Now Showing
            </a>
            <a href="#coming-soon" id="btn-soon" className="px-8 py-3 border border-gray-600 hover:border-gray-500 hover:bg-gray-800 text-white rounded-lg font-medium transition transform hover:-translate-y-0.5">
              Coming Soon
            </a>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-gray-900 to-transparent pointer-events-none"></div>
      </section>

      {/* Main Containers */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-12 space-y-16">
        
        {/* Now Showing Section */}
        <section id="now-showing" className="space-y-8 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-gray-850 pb-4">
            <div>
              <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-6 bg-[#F84565] rounded-full inline-block"></span>
                Now Showing
              </h2>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">Top rated movies playing in theaters near you</p>
            </div>
            <Link href="/movies" className="text-sm font-semibold text-blue-400 hover:text-blue-300 hover:underline transition">
              View All
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col space-y-3">
                  <div className="bg-gray-800 h-80 rounded-xl w-full"></div>
                  <div className="bg-gray-800 h-6 rounded w-3/4"></div>
                  <div className="bg-gray-800 h-4 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {availableMovies.map((movie) => (
                <div key={movie._id} className="group relative bg-gray-850 rounded-xl overflow-hidden shadow-lg border border-gray-800/80 hover:border-[#F84565]/40 transition duration-300 flex flex-col h-full transform hover:-translate-y-2">
                  
                  {/* Poster Image */}
                  <div className="relative aspect-2/3 w-full overflow-hidden bg-gray-800">
                    <Image
                      src={movie.posterUrl}
                      alt={movie.title}
                      fill
                      className="object-cover w-full h-full transform group-hover:scale-105 transition duration-500"
                      loading="lazy"
                    />
                    
                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 bg-gray-900/90 backdrop-blur-xs px-2.5 py-1 rounded-md border border-yellow-500/25 flex items-center gap-1.5 shadow-md">
                      <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs font-bold text-yellow-500">{movie.rating}</span>
                    </div>

                    {/* Quick Info Hover Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                      <p className="text-xs text-gray-300 line-clamp-3">{movie.description}</p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex flex-col justify-between grow space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg text-white group-hover:text-[#F84565] transition line-clamp-1">
                        {movie.title}
                      </h3>
                      
                      {/* Categories */}
                      <div className="flex flex-wrap gap-1.5">
                        {renderCategories(movie.catagory).map((cat, idx) => (
                          <span key={idx} className="text-[10px] font-medium text-gray-400 bg-gray-800 px-2 py-0.5 rounded border border-gray-700">
                            {String(cat)}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link 
                      href={`/booking/${movie._id}`}
                      id={`book-${movie._id}`}
                      className="w-full text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition transform active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                      Book Ticket
                    </Link>
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>

        {/* Coming Soon Section */}
        <section id="coming-soon" className="space-y-8 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-gray-850 pb-4">
            <div>
              <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-6 bg-blue-500 rounded-full inline-block"></span>
                Coming Soon
              </h2>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">Top rated upcoming blockbusters you cannot miss</p>
            </div>
            <Link href="/movies?status=soon" className="text-sm font-semibold text-blue-400 hover:text-blue-300 hover:underline transition">
              View All
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col space-y-3">
                  <div className="bg-gray-800 h-80 rounded-xl w-full"></div>
                  <div className="bg-gray-800 h-6 rounded w-3/4"></div>
                  <div className="bg-gray-800 h-4 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {comingSoonMovies.map((movie) => (
                <div key={movie._id} className="group relative bg-gray-850 rounded-xl overflow-hidden shadow-lg border border-gray-800/80 hover:border-blue-500/40 transition duration-300 flex flex-col h-full transform hover:-translate-y-2">
                  
                  {/* Poster Image */}
                  <div className="relative aspect-2/3 w-full overflow-hidden bg-gray-800">
                    <Image 
                      src={movie.posterUrl} 
                      alt={movie.title} 
                      className="object-cover w-full h-full transform group-hover:scale-105 transition duration-500" 
                      loading="lazy"
                    />
                    
                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 bg-gray-900/90 backdrop-blur-xs px-2.5 py-1 rounded-md border border-yellow-500/25 flex items-center gap-1.5 shadow-md">
                      <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs font-bold text-yellow-500">{movie.rating}</span>
                    </div>

                    {/* Release Date overlay */}
                    {movie.releaseDate && (
                      <div className="absolute bottom-3 left-3 bg-[#F84565]/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-bold text-white shadow-md">
                        Releasing: {new Date(movie.releaseDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex flex-col justify-between grow space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition line-clamp-1">
                        {movie.title}
                      </h3>
                      
                      {/* Categories */}
                      <div className="flex flex-wrap gap-1.5">
                        {renderCategories(movie.catagory).map((cat, idx) => (
                          <span key={idx} className="text-[10px] font-medium text-gray-400 bg-gray-800 px-2 py-0.5 rounded border border-gray-700">
                            {String(cat)}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button 
                      disabled
                      id={`soon-${movie._id}`}
                      className="w-full text-center py-2.5 bg-gray-800 text-gray-500 rounded-lg font-medium text-sm cursor-not-allowed border border-gray-750 flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Coming Soon
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  )
}