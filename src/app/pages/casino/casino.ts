import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CasinoService } from '../../services/casino';

@Component({
  selector: 'app-casino',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './casino.html',
  styleUrls: ['./casino.css']
})
export class Casino implements OnInit {
  username = '';
  zodiac = '';
  stack = '';
  experience = '';
  betAmount = 0;
  message = '';
  correctCode = '';
  buggyCode = '';

  constructor(private casinoService: CasinoService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.username = sessionStorage.getItem('username') ?? '';
      this.zodiac = sessionStorage.getItem('zodiac') ?? '';
      this.stack = sessionStorage.getItem('stack') ?? '';
      this.experience = sessionStorage.getItem('experience') ?? '';
    }

    this.fetchSnippets();
  }

  fetchSnippets() {
    this.casinoService.getSnippets({
      stack: this.stack,
      experience: this.experience
    }).subscribe({
      next: (res) => {
        this.correctCode = res.correctCode;
        this.buggyCode = res.buggyCode;
      },
      error: (err) => {
        console.warn('Using mock data (fetch):', err.message);
        this.correctCode = 'function login() {\n  return true;\n}';
        this.buggyCode = 'function login() {\n  return false;\n}';
      }
    });
  }

  choose(code: string) {
    this.casinoService.getSnippets({
      stack: this.stack,
      experience: this.experience
    }).subscribe({
      next: (res) => {
        this.correctCode = res.correctCode;
        this.buggyCode = res.buggyCode;
      },
      error: (err) => {
        console.warn('Using mock data (choose):', err.message);
        this.correctCode = 'function multiply(x, y) {\n  return x * y;\n}';
        this.buggyCode = 'function multiply(x, y) {\n  return x + y;\n}';
      }
    });
  }
}
