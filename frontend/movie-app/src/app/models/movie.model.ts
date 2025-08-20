export interface Movie {
  _id: string;
  title: string;
  year: number;
  poster?: string;
  genres: string[];
  imdb: {
    rating?: number;
    votes?: number;
    id?: string;
  };
  plot?: string;
  fullplot?: string;
  directors?: string[];
  writers?: string[];
  cast?: string[];
  countries?: string[];
  languages?: string[];
  runtime?: number;
  released?: Date;
  rated?: string;
  type?: string;
  awards?: {
    wins?: number;
    nominations?: number;
    text?: string;
  };
  metacritic?: number;
  tomatoes?: {
    viewer?: {
      rating?: number;
      numReviews?: number;
    };
    critic?: {
      rating?: number;
      numReviews?: number;
    };
    rotten?: number;
    fresh?: number;
  };
}

export interface MoviesResponse {
  movies: Movie[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AlphabetLetter {
  letter: string;
  count: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}