import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

export interface CodeSnippet {
  id: string;
  code: string;
  language: string;
  isCorrect: boolean;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  bugType?: string;
  category?: string;
}

export interface Battle {
  id: string;
  snippets: CodeSnippet[];
  userStack: string;
  difficulty: string;
  pointsAtStake: number;
  timeLimit: number;
  status: 'active' | 'completed' | 'expired';
  createdAt: Date;
  expiresAt: Date;
}

export interface BattleResult {
  battleId: string;
  selectedSnippetId: string;
  isCorrect: boolean;
  correctSnippetId: string;
  pointsWon: number;
  pointsLost: number;
  explanation: string;
  streakBroken: boolean;
  newStreak: number;
}

@Injectable({
  providedIn: 'root'
})
export class CodeBattleService {
  private apiUrl = 'http://localhost:3000/api/casino/battle';
  
  // Battle state management
  private currentBattleSubject = new BehaviorSubject<Battle | null>(null);
  private battleHistorySubject = new BehaviorSubject<Battle[]>([]);

  // Public observables
  public currentBattle$ = this.currentBattleSubject.asObservable();
  public battleHistory$ = this.battleHistorySubject.asObservable();

  constructor(private http: HttpClient) {}

  // Create new battle
  createBattle(userStack: string, betAmount: number): Observable<Battle> {
    const battleRequest = {
      userStack,
      betAmount,
      difficulty: this.determineDifficulty(betAmount)
    };

    return this.http.post<Battle>(`${this.apiUrl}/create`, battleRequest, {
      withCredentials: true
    }).pipe(
      tap(battle => {
        this.currentBattleSubject.next(battle);
      }),
      catchError(this.handleError)
    );
  }

  // Submit answer
  submitAnswer(battleId: string, selectedSnippetId: string): Observable<BattleResult> {
    return this.http.post<BattleResult>(`${this.apiUrl}/${battleId}/submit`, {
      selectedSnippetId
    }, {
      withCredentials: true
    }).pipe(
      tap(result => {
        // Update battle status to completed
        const currentBattle = this.currentBattleSubject.value;
        if (currentBattle) {
          currentBattle.status = 'completed';
          this.currentBattleSubject.next(currentBattle);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Get battle history
  getBattleHistory(limit: number = 10): Observable<Battle[]> {
    return this.http.get<Battle[]>(`${this.apiUrl}/history?limit=${limit}`, {
      withCredentials: true
    }).pipe(
      tap(history => {
        this.battleHistorySubject.next(history);
      }),
      catchError(this.handleError)
    );
  }

  // Get battle by ID
  getBattle(battleId: string): Observable<Battle> {
    return this.http.get<Battle>(`${this.apiUrl}/${battleId}`, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Generate practice battle (for daily challenge)
  createPracticeBattle(difficulty: string): Observable<Battle> {
    return this.http.post<Battle>(`${this.apiUrl}/practice`, {
      difficulty
    }, {
      withCredentials: true
    }).pipe(
      tap(battle => {
        this.currentBattleSubject.next(battle);
      }),
      catchError(this.handleError)
    );
  }

  // Clear current battle
  clearCurrentBattle(): void {
    this.currentBattleSubject.next(null);
  }

  // Determine difficulty based on bet amount
  private determineDifficulty(betAmount: number): string {
    if (betAmount <= 10) return 'easy';
    if (betAmount <= 25) return 'medium';
    return 'hard';
  }

  // Error handling
  private handleError = (error: any): Observable<never> => {
    console.error('CodeBattleService Error:', error);
    
    let errorMessage = 'Battle service error occurred';
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(errorMessage);
  }

  // Get current battle (synchronous access)
  get currentBattle(): Battle | null {
    return this.currentBattleSubject.value;
  }

  get battleHistory(): Battle[] {
    return this.battleHistorySubject.value;
  }
}
