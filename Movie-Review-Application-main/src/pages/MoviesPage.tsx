import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Movie, MovieFilters, SortOption } from '../types';
import { searchMovies } from '../services/api';
import MovieCard from '../components/movies/MovieCard';
import SearchFilters from '../components/movies/SearchFilters';
import Button from '../components/ui/Button';

const MoviesPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('query') || '';
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filters, setFilters] = useState<MovieFilters>({ query: initialQuery });
  const [sort, setSort] = useState<SortOption>('popularity.desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      try {
        const result = await searchMovies(filters, sort, currentPage);
        setMovies(result.results);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error('Failed to load movies', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMovies();
  }, [filters, sort, currentPage]);
  
  const handleSearch = (newFilters: MovieFilters, newSort: SortOption) => {
    setFilters(newFilters);
    setSort(newSort);
    setCurrentPage(1); // Reset to first page on new search
    
    // Update URL query parameters
    const params = new URLSearchParams();
    if (newFilters.query) params.set('query', newFilters.query);
    window.history.replaceState(
      {}, 
      '', 
      `${window.location.pathname}${newFilters.query ? `?${params}` : ''}`
    );
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Discover Movies</h1>
        
        <div className="mb-8">
          <SearchFilters 
            initialFilters={filters}
            onSearch={handleSearch}
          />
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
        ) : movies.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-sm text-center">
            <h3 className="text-xl font-semibold mb-4">No movies found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters to find what you're looking for.
            </p>
            <Button onClick={() => handleSearch({ query: '' }, 'popularity.desc')}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    variant="outline"
                    leftIcon={<ArrowLeft className="h-4 w-4" />}
                  >
                    Previous
                  </Button>
                  
                  <span className="text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <Button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;