import React, { useState } from 'react';
import { Flag, ThumbsUp } from 'lucide-react';
import { Review } from '../../types';
import { formatDate } from '../../lib/utils';
import StarRating from '../ui/StarRating';

interface ReviewItemProps {
  review: Review;
  onFlag: (reviewId: string) => void;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review, onFlag }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(review.likes);
  const [isFlagged, setIsFlagged] = useState(review.isFlagged);
  
  const handleLike = () => {
    if (!isLiked) {
      setLikes(likes + 1);
      setIsLiked(true);
    } else {
      setLikes(likes - 1);
      setIsLiked(false);
    }
    // In a real app, this would call an API to update the like count
  };
  
  const handleFlag = () => {
    if (!isFlagged) {
      setIsFlagged(true);
      onFlag(review.id);
    }
  };
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start mb-3">
        <div className="flex-shrink-0 mr-4">
          {review.userAvatar ? (
            <img 
              src={review.userAvatar} 
              alt={review.username} 
              className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              {review.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">{review.username}</h4>
              <div className="flex items-center space-x-2">
                <StarRating rating={review.rating} readOnly size="sm" />
                <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={handleLike}
                className={`flex items-center space-x-1 text-sm px-2 py-1 rounded-full hover:bg-gray-100 transition-colors ${isLiked ? 'text-blue-600' : 'text-gray-500'}`}
                aria-label="Like review"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{likes}</span>
              </button>
              
              <button 
                onClick={handleFlag}
                disabled={isFlagged}
                className={`flex items-center space-x-1 text-sm px-2 py-1 rounded-full hover:bg-gray-100 transition-colors ${isFlagged ? 'text-red-600 opacity-50' : 'text-gray-500'}`}
                aria-label="Flag review"
              >
                <Flag className="h-4 w-4" />
                <span>{isFlagged ? 'Flagged' : 'Flag'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pl-16">
        <p className="text-gray-700 whitespace-pre-line">{review.content}</p>
      </div>
    </div>
  );
};

export default ReviewItem;