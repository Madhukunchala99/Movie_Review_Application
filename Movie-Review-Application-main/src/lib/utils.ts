import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getYearFromDate(dateString: string): string {
  return new Date(dateString).getFullYear().toString();
}

export function calculateAverageRating(ratings: number[]): number {
  if (!ratings.length) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return Number((sum / ratings.length).toFixed(1));
}

export function validateReview(text: string): { valid: boolean; message?: string } {
  if (text.length < 50) {
    return { valid: false, message: 'Review must be at least 50 characters' };
  }
  if (text.length > 1000) {
    return { valid: false, message: 'Review cannot exceed 1000 characters' };
  }
  
  // Simple profanity check (to be expanded in production)
  const profanityList = ['badword1', 'badword2'];
  const hasProfanity = profanityList.some(word => 
    text.toLowerCase().includes(word.toLowerCase())
  );
  
  if (hasProfanity) {
    return { valid: false, message: 'Review contains inappropriate language' };
  }
  
  return { valid: true };
}