export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genres: Genre[];
  runtime?: number;
  cast?: CastMember[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Review {
  id: string;
  movieId: number;
  userId: string;
  username: string;
  userAvatar?: string;
  rating: number;
  content: string;
  createdAt: string;
  isFlagged: boolean;
  likes: number;
}

export interface MovieFilters {
  query: string;
  year?: string;
  genre?: number;
  rating?: number;
}

export type SortOption = 'popularity.desc' | 'vote_average.desc' | 'release_date.desc' | 'release_date.asc';