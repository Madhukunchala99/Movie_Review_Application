import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, FilmIcon, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Review } from '../types';
import { fetchMovieReviews } from '../services/api';
import ReviewItem from '../components/reviews/ReviewItem';
import Button from '../components/ui/Button';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const loadUserReviews = async () => {
      setIsLoading(true);
      try {
        // In a real app, we would fetch user reviews from the backend
        // For this demo, we'll use our mock reviews
        const allReviews = await Promise.all([
          fetchMovieReviews(1),
          fetchMovieReviews(2),
          fetchMovieReviews(3),
          fetchMovieReviews(4)
        ]);
        
        const reviews = allReviews.flat().filter(review => review.userId === user?.id);
        setUserReviews(reviews);
      } catch (error) {
        console.error('Failed to load user reviews', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserReviews();
  }, [isAuthenticated, navigate, user]);
  
  const handleFlagReview = (reviewId: string) => {
    // In a real app, this would call an API
    console.log('Flag review:', reviewId);
  };
  
  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Sidebar */}
          <div className="md:w-1/3 lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-red-600 h-24"></div>
              <div className="px-6 pb-6">
                <div className="flex justify-center -mt-12 mb-4">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.username} 
                      className="h-24 w-24 rounded-full border-4 border-white object-cover"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center">
                      <UserIcon className="h-12 w-12 text-gray-500" />
                    </div>
                  )}
                </div>
                <h1 className="text-xl font-bold text-center mb-2">{user.username}</h1>
                <p className="text-gray-600 text-center mb-6">{user.email}</p>
                
                <div className="flex justify-center">
                  <Button 
                    variant="outline"
                    leftIcon={<Edit className="h-4 w-4" />}
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm mt-6 p-6">
              <h3 className="text-lg font-semibold mb-4">Account Stats</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Reviews</span>
                  <span className="font-semibold">{userReviews.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Liked Reviews</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Account Created</span>
                  <span className="font-semibold">June 2024</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:w-2/3 lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold mb-6">My Reviews</h2>
              
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
              ) : userReviews.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <FilmIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
                  <p className="text-gray-600 mb-6">
                    You haven't written any movie reviews yet. Start by exploring movies and sharing your thoughts!
                  </p>
                  <Button onClick={() => navigate('/movies')}>
                    Browse Movies
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {userReviews.map(review => (
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
    </div>
  );
};

export default ProfilePage;