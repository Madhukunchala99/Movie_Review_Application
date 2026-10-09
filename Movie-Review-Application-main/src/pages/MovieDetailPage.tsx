import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, Star, Calendar, Tag } from 'lucide-react';
import { Movie, Review } from '../types';
import { fetchMovieDetails, fetchMovieReviews, postReview, flagReview } from '../services/api';
import { formatDate, calculateAverageRating } from '../lib/utils';
import ReviewItem from '../components/reviews/ReviewItem';
import ReviewForm from '../components/reviews/ReviewForm';
import StarRating from '../components/ui/StarRating';
import { useAuth } from '../contexts/AuthContext';

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  
  useEffect(() => {
    const loadMovieData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const [movieData, reviewsData] = await Promise.all([
          fetchMovieDetails(parseInt(id)),
          fetchMovieReviews(parseInt(id))
        ]);
        
        setMovie(movieData);
        setReviews(reviewsData);
        
        // Check if user has already reviewed this movie
        if (isAuthenticated && user) {
          const hasReviewed = reviewsData.some(review => review.userId === user.id);
          setUserHasReviewed(hasReviewed);
        }
      } catch (error) {
        console.error('Failed to load movie data', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMovieData();
  }, [id, isAuthenticated, user]);
  
  const handleSubmitReview = async (rating: number, content: string) => {
    if (!movie || !isAuthenticated || !user) return;
    
    try {
      const newReview = await postReview({
        movieId: movie.id,
        userId: user.id,
        username: user.username,
        userAvatar: user.avatar,
        rating,
        content
      });
      
      setReviews(prev => [newReview, ...prev]);
      setUserHasReviewed(true);
    } catch (error) {
      console.error('Failed to submit review', error);
      throw error;
    }
  };
  
  const handleFlagReview = async (reviewId: string) => {
    try {
      await flagReview(reviewId);
      // Update the UI to show the review as flagged
      setReviews(prev => 
        prev.map(review => 
          review.id === reviewId 
            ? { ...review, isFlagged: true } 
            : review
        )
      );
    } catch (error) {
      console.error('Failed to flag review', error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }
  
  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Movie Not Found</h1>
        <p className="text-gray-600 mb-6">The movie you're looking for doesn't exist or has been removed.</p>
        <a href="/movies" className="text-red-600 hover:text-red-700 font-medium">
          Browse All Movies
        </a>
      </div>
    );
  }
  
  const averageRating = calculateAverageRating(reviews.map(review => review.rating));
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Backdrop */}
      <div className="relative bg-gray-900 text-white">
        {movie.backdrop_path && (
          <div className="absolute inset-0 overflow-hidden">
            <img 
              src={movie.backdrop_path} 
              alt={`${movie.title} backdrop`} 
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/90 to-gray-900/80" />
          </div>
        )}
        
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Movie Poster */}
            <div className="md:w-1/3 lg:w-1/4 flex-shrink-0">
              <div className="rounded-lg overflow-hidden shadow-lg bg-gray-800">
                {movie.poster_path ? (
                  <img 
                    src={movie.poster_path} 
                    alt={movie.title}
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="aspect-[2/3] bg-gray-800 flex items-center justify-center text-gray-500">
                    No Image Available
                  </div>
                )}
              </div>
            </div>
            
            {/* Movie Details */}
            <div className="md:w-2/3 lg:w-3/4">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{movie.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-300">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-1" />
                  <span>{formatDate(movie.release_date)}</span>
                </div>
                
                {movie.runtime && (
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-1" />
                    <span>{movie.runtime} min</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-1 text-amber-400" />
                  <span>{movie.vote_average.toFixed(1)} ({movie.vote_count} votes)</span>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genres.map(genre => (
                    <span 
                      key={genre.id}
                      className="inline-block px-3 py-1 bg-red-600 rounded-full text-sm font-medium"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
                
                <p className="text-lg leading-relaxed mb-6">{movie.overview}</p>
                
                {movie.cast && movie.cast.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Tag className="h-5 w-5 mr-2" />
                      Cast
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {movie.cast.map(person => (
                        <div key={person.id} className="flex items-center space-x-2">
                          <span className="font-medium">{person.name}</span>
                          <span className="text-gray-400">as {person.character}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Review Form */}
          <div className="md:w-1/3 lg:w-1/4 space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Movie Rating</h3>
              
              <div className="flex items-center space-x-2 mb-2">
                <StarRating rating={averageRating > 0 ? Math.round(averageRating) : 0} readOnly size="lg" />
                <span className="text-xl font-bold">{averageRating.toFixed(1)}</span>
              </div>
              
              <p className="text-gray-600 text-sm">
                Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </p>
            </div>
            
            {!userHasReviewed && (
              <ReviewForm 
                movieId={movie.id} 
                onSubmit={handleSubmitReview} 
              />
            )}
          </div>
          
          {/* Right Column - Reviews List */}
          <div className="md:w-2/3 lg:w-3/4">
            <h2 className="text-2xl font-bold mb-6">
              Reviews {reviews.length > 0 && `(${reviews.length})`}
            </h2>
            
            {reviews.length === 0 ? (
              <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                <p className="text-gray-600 mb-4">There are no reviews for this movie yet.</p>
                {!userHasReviewed && isAuthenticated && (
                  <p className="text-gray-800 font-medium">Be the first to share your thoughts!</p>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map(review => (
                  <ReviewItem 
                    key={review.id} 
                    review={review}
                    onFlag={handleFlagReview}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;