import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Movie, MoviesResponse, AlphabetLetter, ApiResponse } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getAlphabetLetters(): Observable<AlphabetLetter[]> {
    return this.http.get<ApiResponse<AlphabetLetter[]>>(`${this.apiUrl}/movies/alphabet`)
      .pipe(
        map(response => response.data || []),
        catchError(this.handleError)
      );
  }

  getMoviesByLetter(letter: string, page: number = 1, limit: number = 15): Observable<MoviesResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ApiResponse<MoviesResponse>>(`${this.apiUrl}/movies/by-letter/${letter}`, { params })
      .pipe(
        map(response => response.data || { movies: [], total: 0, page: 1, totalPages: 0 }),
        catchError(this.handleError)
      );
  }

  getMovieById(id: string): Observable<Movie> {
    return this.http.get<ApiResponse<Movie>>(`${this.apiUrl}/movies/${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  searchMovies(query: string, page: number = 1, limit: number = 15): Observable<MoviesResponse> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ApiResponse<MoviesResponse>>(`${this.apiUrl}/movies/search`, { params })
      .pipe(
        map(response => response.data || { movies: [], total: 0, page: 1, totalPages: 0 }),
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('MovieService error:', error);
    let errorMessage = 'An unknown error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.status) {
      switch (error.status) {
        case 0:
          errorMessage = 'Unable to connect to the server. Please check if the backend is running.';
          break;
        case 404:
          errorMessage = 'Resource not found';
          break;
        case 500:
          errorMessage = 'Server error occurred';
          break;
        default:
          errorMessage = `Server error: ${error.status}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}