import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Film } from 'lucide-react';
import { Movie } from '../types';
import { fetchTrendingMovies, fetchPopularMovies } from '../services/api';
import MovieCard from '../components/movies/MovieCard';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      try {
        const [trending, popular] = await Promise.all([
          fetchTrendingMovies(),
          fetchPopularMovies()
        ]);
        
        setTrendingMovies(trending);
        setPopularMovies(popular);
      } catch (error) {
        console.error('Failed to load movies', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMovies();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg" 
            alt="Hero background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-gray-900/70" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Discover, Review, and Share Your <span className="text-red-500">Favorite Movies</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Join our community of film enthusiasts. Find new movies, rate what you've watched, and see what others are saying.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/movies">
                <Button size="lg" leftIcon={<Film className="h-5 w-5" />}>
                  Browse Movies
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Sign Up & Start Reviewing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trending Movies Section */}
      <section className="py-12 max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Trending Movies</h2>
          <Link 
            to="/movies" 
            className="flex items-center text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="ml-1 h-5 w-5" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden shadow animate-pulse">
                <div className="bg-gray-300 aspect-[2/3]"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 rounded-full w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded-full"></div>
                  <div className="h-3 bg-gray-300 rounded-full w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trendingMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
      
      {/* Popular Movies Section */}
      <section className="py-12 max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Popular Movies</h2>
          <Link 
            to="/movies" 
            className="flex items-center text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="ml-1 h-5 w-5" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden shadow animate-pulse">
                <div className="bg-gray-300 aspect-[2/3]"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 rounded-full w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded-full"></div>
                  <div className="h-3 bg-gray-300 rounded-full w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {popularMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Why Choose CineCritic?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-full text-red-600 mb-4">
                <Film className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Discover New Films</h3>
              <p className="text-gray-600">
                Find your next favorite movie with our curated recommendations and comprehensive search filters.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Share Your Thoughts</h3>
              <p className="text-gray-600">
                Rate and review movies you've watched to help others discover great content and express your opinions.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-full text-amber-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Join the Community</h3>
              <p className="text-gray-600">
                Connect with other movie lovers, like and comment on reviews, and build your personal watch history.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;