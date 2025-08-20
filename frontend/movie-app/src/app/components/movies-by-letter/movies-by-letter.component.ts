import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subject, takeUntil } from 'rxjs';
import { MovieService } from '../../services/movie.service';
import { Movie, MoviesResponse } from '../../models/movie.model';

@Component({
  selector: 'app-movies-by-letter',
  standalone: true,
  imports: [
    CommonModule, 
    MatProgressSpinnerModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatPaginatorModule
  ],
  templateUrl: './movies-by-letter.component.html',
  styleUrls: ['./movies-by-letter.component.scss']
})
export class MoviesByLetterComponent implements OnInit, OnDestroy {
  letter = '';
  movies: Movie[] = [];
  loading = false;
  error: string | null = null;
  
  // Pagination
  currentPage = 1;
  totalMovies = 0;
  totalPages = 0;
  moviesPerPage = 15;
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.letter = params['letter']?.toUpperCase() || '';
      this.currentPage = 1;
      this.loadMovies();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMovies(): void {
    if (!this.letter) return;
    
    this.loading = true;
    this.error = null;

    this.movieService.getMoviesByLetter(this.letter, this.currentPage, this.moviesPerPage)
      .subscribe({
        next: (response: MoviesResponse) => {
          this.movies = response.movies;
          this.totalMovies = response.total;
          this.totalPages = response.totalPages;
          this.loading = false;
        },
        error: (error) => {
          this.error = error.message;
          this.loading = false;
          this.movies = [];
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.moviesPerPage = event.pageSize;
    this.loadMovies();
    window.scrollTo(0, 0);
  }

  onMovieClick(movieId: string): void {
    this.router.navigate(['/movie', movieId]);
  }

  onBackToHome(): void {
    this.router.navigate(['/']);
  }

  getMoviePoster(movie: Movie): string {
    return movie.poster || '/assets/images/no-poster.svg';
  }

  getMovieRating(movie: Movie): string {
    if (movie.imdb?.rating) {
      return movie.imdb.rating.toFixed(1);
    }
    return 'N/A';
  }

  getMovieGenres(movie: Movie): string {
    if (movie.genres && movie.genres.length > 0) {
      return movie.genres.slice(0, 3).join(', ');
    }
    return 'Unknown';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/images/no-poster.svg';
  }

  trackByMovieId(index: number, movie: Movie): string {
    return movie._id;
  }
}