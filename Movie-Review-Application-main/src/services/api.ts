import axios from 'axios';
import { Movie, Review, MovieFilters, Genre, SortOption } from '../types';

// In a real app, you would store this in environment variables
const API_KEY = 'demo_key';
const BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Movie APIs
export const fetchTrendingMovies = async (): Promise<Movie[]> => {
  // In a real implementation, this would call the actual TMDB API
  // For demo purposes, we'll return mock data
  return Promise.resolve(mockTrendingMovies);
};

export const fetchPopularMovies = async (): Promise<Movie[]> => {
  return Promise.resolve(mockPopularMovies);
};

export const fetchMovieDetails = async (id: number): Promise<Movie> => {
  // Find movie in our mock data or return a default
  const movie = [...mockTrendingMovies, ...mockPopularMovies].find(m => m.id === id);
  return Promise.resolve(movie || mockTrendingMovies[0]);
};

export const searchMovies = async (
  filters: MovieFilters,
  sort: SortOption = 'popularity.desc',
  page: number = 1
): Promise<{ results: Movie[]; totalPages: number }> => {
  // Filter mock movies based on filters
  let results = [...mockTrendingMovies, ...mockPopularMovies];
  
  if (filters.query) {
    const query = filters.query.toLowerCase();
    results = results.filter(movie => 
      movie.title.toLowerCase().includes(query)
    );
  }
  
  if (filters.year) {
    results = results.filter(movie => 
      movie.release_date.startsWith(filters.year || '')
    );
  }
  
  if (filters.genre && filters.genre > 0) {
    results = results.filter(movie => 
      movie.genres.some(genre => genre.id === filters.genre)
    );
  }
  
  return Promise.resolve({
    results,
    totalPages: 1,
  });
};

export const fetchGenres = async (): Promise<Genre[]> => {
  return Promise.resolve([
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 10770, name: 'TV Movie' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' }
  ]);
};

// Review APIs
export const fetchMovieReviews = async (movieId: number): Promise<Review[]> => {
  return Promise.resolve(mockReviews.filter(review => review.movieId === movieId));
};

export const postReview = async (review: Omit<Review, 'id' | 'createdAt' | 'isFlagged' | 'likes'>): Promise<Review> => {
  const newReview: Review = {
    ...review,
    id: `review-${Date.now()}`,
    createdAt: new Date().toISOString(),
    isFlagged: false,
    likes: 0,
  };
  
  // In a real app, this would send the review to a backend
  return Promise.resolve(newReview);
};

export const flagReview = async (reviewId: string): Promise<void> => {
  // In a real app, this would update the backend
  return Promise.resolve();
};

// Mock Data
const mockTrendingMovies: Movie[] = [
  {
    id: 1,
    title: "Khaleja",
    poster_path: "/src/assets/kl.jpg", 
    backdrop_path: "/src/assets/kl.jpg",
    overview: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    release_date: "2024-03-01",
    vote_average: 8.5,
    vote_count: 2500,
    genres: [
      { id: 878, name: "Science Fiction" },
      { id: 12, name: "Adventure" }
    ],
    runtime: 166,
    cast: [
      { id: 101, name: "Timothée Chalamet", character: "Paul Atreides", profile_path: null },
      { id: 102, name: "Zendaya", character: "Chani", profile_path: null },
      { id: 103, name: "Rebecca Ferguson", character: "Lady Jessica", profile_path: null }
    ]
  },
  {
    id: 2,
    title: "Devara",
    poster_path: "/src/assets/Devara.jpg",
    backdrop_path: "/src/assets/Devara.jpg",
    overview: "When the Riddler, a sadistic serial killer, begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.",
    release_date: "2022-03-04",
    vote_average: 7.8,
    vote_count: 5600,
    genres: [
      { id: 28, name: "Action" },
      { id: 80, name: "Crime" },
      { id: 9648, name: "Mystery" }
    ],
    runtime: 176,
    cast: [
      { id: 201, name: "Robert Pattinson", character: "Bruce Wayne / The Batman", profile_path: null },
      { id: 202, name: "Zoë Kravitz", character: "Selina Kyle / Catwoman", profile_path: null },
      { id: 203, name: "Paul Dano", character: "Edward Nashton / The Riddler", profile_path: null }
    ]
  }
];

const mockPopularMovies: Movie[] = [
  {
    id: 3,
    title: "Oppenheimer",
    poster_path: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg",
    backdrop_path: "https://images.pexels.com/photos/6195058/pexels-photo-6195058.jpeg",
    overview: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    release_date: "2023-07-21",
    vote_average: 8.9,
    vote_count: 4800,
    genres: [
      { id: 18, name: "Drama" },
      { id: 36, name: "History" }
    ],
    runtime: 180,
    cast: [
      { id: 301, name: "Cillian Murphy", character: "J. Robert Oppenheimer", profile_path: null },
      { id: 302, name: "Emily Blunt", character: "Katherine Oppenheimer", profile_path: null },
      { id: 303, name: "Matt Damon", character: "Leslie Groves", profile_path: null }
    ]
  },
  {
    id: 4,
    title: "Barbie",
    poster_path: "https://images.pexels.com/photos/7170640/pexels-photo-7170640.jpeg",
    backdrop_path: "https://images.pexels.com/photos/7599735/pexels-photo-7599735.jpeg",
    overview: "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.",
    release_date: "2023-07-21",
    vote_average: 7.1,
    vote_count: 3200,
    genres: [
      { id: 35, name: "Comedy" },
      { id: 12, name: "Adventure" }
    ],
    runtime: 114,
    cast: [
      { id: 401, name: "Margot Robbie", character: "Barbie", profile_path: null },
      { id: 402, name: "Ryan Gosling", character: "Ken", profile_path: null },
      { id: 403, name: "America Ferrera", character: "Gloria", profile_path: null }
    ]
  }
];

const mockReviews: Review[] = [
  {
    id: "review-1",
    movieId: 1,
    userId: "user-1",
    username: "cinephile42",
    userAvatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    rating: 5,
    content: "Denis Villeneuve has outdone himself with this sequel. The scale is massive, the performances are stellar, and the storytelling is masterful. This is the kind of science fiction epic that comes along once in a generation.",
    createdAt: "2024-03-05T12:34:56Z",
    isFlagged: false,
    likes: 42
  },
  {
    id: "review-2",
    movieId: 1,
    userId: "user-2",
    username: "scifi_lover",
    userAvatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    rating: 4,
    content: "A visual masterpiece with incredible sound design. The story can be a bit dense for newcomers to the franchise, but overall it's a satisfying continuation of the first part. Zendaya and Timothée have great chemistry.",
    createdAt: "2024-03-06T09:12:34Z",
    isFlagged: false,
    likes: 18
  },
  {
    id: "review-3",
    movieId: 2,
    userId: "user-3",
    username: "batman_fan",
    userAvatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
    rating: 5,
    content: "Matt Reeves has created the most atmospheric and detective-focused Batman film yet. Robert Pattinson embodies the character perfectly, showing both the trauma and determination that drives Bruce Wayne. The Riddler is genuinely terrifying.",
    createdAt: "2022-03-10T15:00:00Z",
    isFlagged: false,
    likes: 103
  }
];