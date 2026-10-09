import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Genre, MovieFilters, SortOption } from '../../types';
import { fetchGenres } from '../../services/api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

interface SearchFiltersProps {
  initialFilters: MovieFilters;
  onSearch: (filters: MovieFilters, sort: SortOption) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ initialFilters, onSearch }) => {
  const [filters, setFilters] = useState<MovieFilters>(initialFilters);
  const [sort, setSort] = useState<SortOption>('popularity.desc');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genreData = await fetchGenres();
        setGenres(genreData);
      } catch (error) {
        console.error('Failed to load genres', error);
      }
    };
    
    loadGenres();
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleGenreChange = (value: string) => {
    setFilters(prev => ({ ...prev, genre: value ? parseInt(value) : undefined }));
  };
  
  const handleYearChange = (value: string) => {
    setFilters(prev => ({ ...prev, year: value || undefined }));
  };
  
  const handleRatingChange = (value: string) => {
    setFilters(prev => ({ ...prev, rating: value ? parseInt(value) : undefined }));
  };
  
  const handleSortChange = (value: string) => {
    setSort(value as SortOption);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters, sort);
    setIsFilterOpen(false);
  };
  
  const handleReset = () => {
    setFilters({ query: '' });
    setSort('popularity.desc');
  };
  
  // Generate year options (from current year to 1970)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1969 }, (_, i) => {
    const year = currentYear - i;
    return { value: year.toString(), label: year.toString() };
  });
  yearOptions.unshift({ value: '', label: 'Any Year' });
  
  // Generate rating options
  const ratingOptions = [
    { value: '', label: 'Any Rating' },
    { value: '9', label: '9+ Stars' },
    { value: '8', label: '8+ Stars' },
    { value: '7', label: '7+ Stars' },
    { value: '6', label: '6+ Stars' },
    { value: '5', label: '5+ Stars' }
  ];
  
  // Generate sort options
  const sortOptions = [
    { value: 'popularity.desc', label: 'Most Popular' },
    { value: 'vote_average.desc', label: 'Highest Rated' },
    { value: 'release_date.desc', label: 'Newest' },
    { value: 'release_date.asc', label: 'Oldest' }
  ];
  
  // Generate genre options
  const genreOptions = [
    { value: '', label: 'All Genres' },
    ...genres.map(genre => ({ value: genre.id.toString(), label: genre.name }))
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <form onSubmit={handleSubmit}>
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-grow">
              <Input
                name="query"
                value={filters.query}
                onChange={handleInputChange}
                placeholder="Search for movies..."
                leftIcon={<Search className="h-5 w-5" />}
                fullWidth
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                type="button"
                variant={isFilterOpen ? 'primary' : 'outline'}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                leftIcon={<SlidersHorizontal className="h-4 w-4" />}
              >
                Filters
              </Button>
              
              <Button type="submit">
                Search
              </Button>
            </div>
          </div>
          
          {isFilterOpen && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
                label="Genre"
                options={genreOptions}
                value={filters.genre?.toString() || ''}
                onChange={handleGenreChange}
              />
              
              <Select
                label="Year"
                options={yearOptions}
                value={filters.year || ''}
                onChange={handleYearChange}
              />
              
              <Select
                label="Rating"
                options={ratingOptions}
                value={filters.rating?.toString() || ''}
                onChange={handleRatingChange}
              />
              
              <Select
                label="Sort By"
                options={sortOptions}
                value={sort}
                onChange={handleSortChange}
              />
              
              <div className="md:col-span-4 flex justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleReset}
                  leftIcon={<X className="h-4 w-4" />}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchFilters;