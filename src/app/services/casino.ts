import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, timer } from 'rxjs';
import { tap, catchError, retry, switchMap } from 'rxjs/operators';
import { UserService } from './user';


export interface UserStats {
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  todaysChallengeCompleted: boolean;
  luckMultiplier: number;
  totalGamesPlayed: number;
  winRate: number;
  lastPlayedDate: string;
  dailyChallengeStreak: number;
}

export interface LeaderboardEntry {
  username: string;
  firstName: string;
  totalPoints: number;
  winRate: number;
  longestStreak: number;
  rank: number;
  zodiacSign?: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  reward: number;
  isCompleted: boolean;
  expiresAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CasinoService {
  private apiUrl = 'http://localhost:3000/api/casino';
  
  // State management
  private userStatsSubject = new BehaviorSubject<UserStats | null>(null);
  private leaderboardSubject = new BehaviorSubject<LeaderboardEntry[]>([]);
  private dailyChallengeSubject = new BehaviorSubject<DailyChallenge | null>(null);

  // Public observables
  public userStats$ = this.userStatsSubject.asObservable();
  public leaderboard$ = this.leaderboardSubject.asObservable();
  public dailyChallenge$ = this.dailyChallengeSubject.asObservable();
  public statsUpdated$ = this.userStatsSubject.asObservable();
  

  constructor(
    private http: HttpClient,private userService:UserService
    
  ) {
    this.initializeServices();
  }

  private initializeServices(): void {
    // Auto-refresh leaderboard every 30 seconds
    timer(0, 30000).pipe(
      switchMap(() => this.loadLeaderboard())
    ).subscribe();

    // Load daily challenge on service start
    this.loadDailyChallenge().subscribe();
  }

  // Get user stats
  getUserStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.apiUrl}/stats`, {
      withCredentials: true
    }).pipe(
      tap(stats => {
        // Calculate luck multiplier based on zodiac and current streak
        const baseMultiplier = this.calculateZodiacMultiplier();
        const streakBonus = Math.min(stats.currentStreak * 0.1, 1.0); // Max 1.0 bonus
        stats.luckMultiplier = baseMultiplier + streakBonus;
        
        this.userStatsSubject.next(stats);
      }),
      catchError(this.handleError),
      retry(1)
    );
  }

  // Update user stats after game
  updateStats(gameResult: {
    isWin: boolean;
    pointsChanged: number;
    newStreak: number;
  }): Observable<UserStats> {
    return this.http.post<UserStats>(`${this.apiUrl}/stats/update`, gameResult, {
      withCredentials: true
    }).pipe(
      tap(stats => {
        stats.luckMultiplier = this.calculateZodiacMultiplier();
        this.userStatsSubject.next(stats);
      }),
      catchError(this.handleError)
    );
  }

  // Get leaderboard
  loadLeaderboard(limit: number = 10): Observable<LeaderboardEntry[]> {
    return this.http.get<LeaderboardEntry[]>(`${this.apiUrl}/leaderboard?limit=${limit}`).pipe(
      tap(leaderboard => {
        this.leaderboardSubject.next(leaderboard);
      }),
      catchError(this.handleError)
    );
  }

  // Get daily challenge
  loadDailyChallenge(): Observable<DailyChallenge> {
    return this.http.get<DailyChallenge>(`${this.apiUrl}/daily-challenge`, {
      withCredentials: true
    }).pipe(
      tap(challenge => {
        this.dailyChallengeSubject.next(challenge);
      }),
      catchError(this.handleError)
    );
  }

  // Complete daily challenge
  completeDailyChallenge(challengeId: string): Observable<{
    success: boolean;
    pointsEarned: number;
    newStats: UserStats;
  }> {
    return this.http.post<{
      success: boolean;
      pointsEarned: number;
      newStats: UserStats;
    }>(`${this.apiUrl}/daily-challenge/${challengeId}/complete`, {}, {
      withCredentials: true
    }).pipe(
      tap(result => {
        if (result.success) {
          this.userStatsSubject.next(result.newStats);
          // Reload daily challenge
          this.loadDailyChallenge().subscribe();
        }
      }),
      catchError(this.handleError)
    );
  }

  // Calculate zodiac luck multiplier
  private calculateZodiacMultiplier(): number {
    const user = this.userService.currentUser;
    if (!user?.birthDate) return 1.0;

    const birthDate = new Date(user.birthDate);
    const today = new Date();
    
    // Simple zodiac-based multiplier
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    
    // Scorpio (♏) - October 23 - November 21
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
      return 1.2; // 20% bonus for Scorpio
    }
    
    // Other zodiac signs with smaller bonuses
    const zodiacMultipliers: { [key: number]: number } = {
      1: 1.05, // Capricorn/Aquarius
      2: 1.05, // Aquarius/Pisces
      3: 1.1,  // Pisces/Aries
      4: 1.05, // Aries/Taurus
      5: 1.1,  // Taurus/Gemini
      6: 1.05, // Gemini/Cancer
      7: 1.15, // Cancer/Leo
      8: 1.1,  // Leo/Virgo
      9: 1.05, // Virgo/Libra
      10: 1.2, // Libra/Scorpio
      11: 1.2, // Scorpio/Sagittarius
      12: 1.1  // Sagittarius/Capricorn
    };

    return zodiacMultipliers[month] || 1.0;
  }

  // Error handling
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Casino service error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Invalid request - check your input';
          break;
        case 401:
          errorMessage = 'Please log in to play casino games';
          break;
        case 403:
          errorMessage = 'Insufficient permissions';
          break;
        case 429:
          errorMessage = 'Too many requests - please wait';
          break;
        case 500:
          errorMessage = 'Casino server error - please try again';
          break;
        default:
          errorMessage = error.error?.message || 'Unknown error occurred';
      }
    }

    console.error('CasinoService Error:', error);
    return throwError(errorMessage);
  }

  // Get current values (synchronous access)
  get currentUserStats(): UserStats | null {
    return this.userStatsSubject.value;
  }

  get currentLeaderboard(): LeaderboardEntry[] {
    return this.leaderboardSubject.value;
  }

  get currentDailyChallenge(): DailyChallenge | null {
    return this.dailyChallengeSubject.value;
  }
}