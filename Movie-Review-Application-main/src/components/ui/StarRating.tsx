import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onChange,
  size = 'md',
  readOnly = false,
  className,
}) => {
  const [hoverRating, setHoverRating] = useState<number>(0);
  
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };
  
  const handleClick = (index: number) => {
    if (!readOnly && onChange) {
      onChange(index);
    }
  };
  
  const handleMouseEnter = (index: number) => {
    if (!readOnly) {
      setHoverRating(index);
    }
  };
  
  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };
  
  return (
    <div 
      className={cn('flex', className)}
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          className={cn(
            sizes[size],
            'transition-all duration-150',
            (hoverRating !== 0 ? index <= hoverRating : index <= rating) 
              ? 'text-amber-400 fill-amber-400' 
              : 'text-gray-300',
            !readOnly && 'cursor-pointer hover:scale-110'
          )}
          onClick={() => handleClick(index)}
          onMouseEnter={() => handleMouseEnter(index)}
        />
      ))}
    </div>
  );
};

export default StarRating;