import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { validateReview } from '../../lib/utils';
import Button from '../ui/Button';
import StarRating from '../ui/StarRating';

interface ReviewFormProps {
  movieId: number;
  onSubmit: (rating: number, content: string) => Promise<void>;
}

interface FormValues {
  content: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ movieId, onSubmit }) => {
  const { isAuthenticated, user } = useAuth();
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();
  
  const handleFormSubmit = async (data: FormValues) => {
    if (!isAuthenticated) {
      setValidationError('You must be logged in to submit a review');
      return;
    }
    
    if (rating === 0) {
      setValidationError('Please select a rating');
      return;
    }
    
    const validation = validateReview(data.content);
    if (!validation.valid) {
      setValidationError(validation.message || 'Invalid review');
      return;
    }
    
    setValidationError(null);
    setIsSubmitting(true);
    
    try {
      await onSubmit(rating, data.content);
      reset();
      setRating(0);
    } catch (error) {
      setValidationError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-700 mb-4">You need to be logged in to write a review.</p>
        <Button variant="primary" onClick={() => window.location.href = '/login'}>
          Log In to Write a Review
        </Button>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
      
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating
          </label>
          <StarRating 
            rating={rating} 
            onChange={setRating} 
            size="lg" 
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            className={`w-full px-3 py-2 border ${errors.content ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32`}
            placeholder="Share your thoughts on this movie (minimum 50 characters)"
            {...register('content', { 
              required: 'Review content is required', 
              minLength: { 
                value: 50, 
                message: 'Review must be at least 50 characters' 
              },
              maxLength: {
                value: 1000,
                message: 'Review cannot exceed 1000 characters'
              }
            })}
          ></textarea>
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
          
          <div className="mt-1 text-right text-sm text-gray-500">
            <span>Min 50 characters, max 1000</span>
          </div>
        </div>
        
        {validationError && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{validationError}</span>
          </div>
        )}
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            variant="primary"
            isLoading={isSubmitting}
          >
            Submit Review
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;