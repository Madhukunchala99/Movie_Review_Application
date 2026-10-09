import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Movie } from '../../types';
import { cn, truncateText, getYearFromDate } from '../../lib/utils';

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, className }) => {
  return (
    <Link 
      to={`/movie/${movie.id}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-lg shadow-lg bg-white transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl',
        className
      )}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-200">
        {movie.poster_path ? (
          <img
            src={movie.poster_path}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-800 text-white">
            No Image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex flex-wrap gap-2 mb-2">
            {movie.genres.slice(0, 2).map((genre) => (
              <span 
                key={genre.id}
                className="inline-block px-2 py-1 text-xs font-medium bg-red-600 rounded-full"
              >
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col flex-grow p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">{getYearFromDate(movie.release_date)}</span>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{movie.vote_average.toFixed(1)}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold leading-tight mb-2">{movie.title}</h3>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {truncateText(movie.overview, 120)}
        </p>
        
        <div className="mt-auto">
          <span className="inline-block py-1 px-4 bg-gray-100 rounded-full text-sm font-medium text-gray-800 hover:bg-red-100 hover:text-red-700 transition-colors">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;