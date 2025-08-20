import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Subject, takeUntil } from 'rxjs';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss']
})
export class MovieDetailComponent implements OnInit, OnDestroy {
  movie: Movie | null = null;
  loading = false;
  error: string | null = null;
  movieId = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.movieId = params['id'];
      if (this.movieId) {
        this.loadMovie();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMovie(): void {
    this.loading = true;
    this.error = null;

    this.movieService.getMovieById(this.movieId).subscribe({
      next: (movie) => {
        this.movie = movie;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  onBack(): void {
    if (this.movie?.title) {
      const firstLetter = this.movie.title.charAt(0).toUpperCase();
      this.router.navigate(['/movies', firstLetter]);
    } else {
      this.router.navigate(['/']);
    }
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

  getMovieRuntime(movie: Movie): string {
    if (movie.runtime) {
      const hours = Math.floor(movie.runtime / 60);
      const minutes = movie.runtime % 60;
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m`;
    }
    return 'Unknown';
  }

  getReleaseYear(movie: Movie): string {
    return movie.year?.toString() || 'Unknown';
  }

  formatReleaseDate(movie: Movie): string {
    if (movie.released) {
      const date = new Date(movie.released);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return 'Unknown';
  }

  getDirectors(movie: Movie): string {
    return movie.directors?.join(', ') || 'Unknown';
  }

  getWriters(movie: Movie): string {
    return movie.writers?.join(', ') || 'Unknown';
  }

  getCast(movie: Movie): string[] {
    return movie.cast?.slice(0, 10) || [];
  }

  getCountries(movie: Movie): string {
    return movie.countries?.join(', ') || 'Unknown';
  }

  getLanguages(movie: Movie): string {
    return movie.languages?.join(', ') || 'Unknown';
  }

  getAwardsText(movie: Movie): string {
    return movie.awards?.text || 'No awards information available';
  }

  getMetacriticScore(movie: Movie): number | null {
    return movie.metacritic || null;
  }

  getTomatoesRating(movie: Movie): number | null {
    return movie.tomatoes?.critic?.rating || null;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/images/no-poster.svg';
  }
}