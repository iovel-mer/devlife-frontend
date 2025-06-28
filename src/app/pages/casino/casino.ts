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
  optionA = '';
  optionB = '';
  correctAnswer = '';
  points = 100;
  streak = 0;
canPlayDaily = true; // როცა ბექი მიაწვდის
leaderboard = [
  { username: 'testuser', points: 500 }, // placeholder
  { username: 'coder123', points: 450 },
  { username: 'devgirl', points: 400 }
];

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
        const shuffled = [res.correctCode, res.buggyCode].sort(() => Math.random() - 0.5);
        this.optionA = shuffled[0];
        this.optionB = shuffled[1];
        this.correctAnswer = res.correctCode;
        this.message = ''; 
      },
      error: (err) => {
        console.warn('Using mock data (fetch):', err.message);
        this.optionA = 'function login() {\n  return true;\n}';
        this.optionB = 'function login() {\n  return false;\n}';
        this.correctAnswer = this.optionA;
      }
    });
  }

  choose(choice: 'A' | 'B') {
    if (this.betAmount <= 0) {
      this.message = "⚠️ Please enter a valid bet amount.";
      return;
    }

    if (this.betAmount > this.points) {
      this.message = "😓 You don't have enough points!";
      return;
    }

    const selectedCode = choice === 'A' ? this.optionA : this.optionB;

    this.casinoService.submitBet({
      selectedCode,
      bet: this.betAmount,
      username: this.username,
      zodiac: this.zodiac
    }).subscribe({
      next: (res) => {
        this.message = res.message;
        this.points += res.pointsDelta;

        if (res.isWin) {
          this.streak += 1;
        } else {
          this.streak = 0;
        }

        this.fetchSnippets(); 
      },
      error: (err) => {
        this.message = "❌ Error occurred while submitting your choice.";
        console.error(err);
      }
    });
  }
  claimDaily() {
  this.casinoService.claimDaily().subscribe({
    next: (res) => {
      this.message = res.message;
      this.points += res.pointsDelta;
      this.canPlayDaily = false;
    },
    error: () => {
      this.message = 'Failed to claim daily reward.';
    }
  });
}

}
