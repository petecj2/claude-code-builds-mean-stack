import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'movies/:letter',
    loadComponent: () => import('./components/movies-by-letter/movies-by-letter.component').then(m => m.MoviesByLetterComponent)
  },
  {
    path: 'movie/:id',
    loadComponent: () => import('./components/movie-detail/movie-detail.component').then(m => m.MovieDetailComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
