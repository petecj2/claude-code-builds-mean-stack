import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MovieService } from '../../services/movie.service';
import { AlphabetLetter } from '../../models/movie.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatCardModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  letters: AlphabetLetter[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private movieService: MovieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAlphabetLetters();
  }

  loadAlphabetLetters(): void {
    this.loading = true;
    this.error = null;

    this.movieService.getAlphabetLetters().subscribe({
      next: (letters) => {
        this.letters = letters;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        // Create default alphabet if API fails
        this.createDefaultAlphabet();
      }
    });
  }

  private createDefaultAlphabet(): void {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.letters = alphabet.split('').map(letter => ({
      letter,
      count: 0
    }));
  }

  onLetterClick(letter: string): void {
    this.router.navigate(['/movies', letter]);
  }

  trackByLetter(index: number, item: AlphabetLetter): string {
    return item.letter;
  }
}