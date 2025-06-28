import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CasinoService {
  private baseUrl = 'http://localhost:3000/casino';

  constructor(private http: HttpClient) {}

  getSnippets(data: { stack: string; experience: string }): Observable<{ correctCode: string; buggyCode: string }> {
    
    return this.http.post<{ correctCode: string; buggyCode: string }>(
      `${this.baseUrl}/snippets`,
      data
    ).pipe(
      catchError(err => {
        console.warn('Backend unreachable, using mock data for getSnippets:', err.message);
        return of({
          correctCode: 'function greet(name) {\n  return "Hello " + name;\n}',
          buggyCode: 'function greet(name) {\n  return "Goodbye " + name;\n}'
        }).pipe(delay(500));
      })
    );
  }

  submitBet(data: {
    selectedCode: string;
    bet: number;
    username: string;
    zodiac: string;
  }): Observable<{ message: string; isWin: boolean; pointsDelta: number }> {
    return this.http.post<{ message: string; isWin: boolean; pointsDelta: number }>(
      `${this.baseUrl}/bet`,
      data
    ).pipe(
      catchError(err => {
        console.warn('Backend unreachable, using mock data for submitBet:', err.message);

        const isWin = Math.random() > 0.5;
        const pointsDelta = isWin ? data.bet * 2 : -data.bet;

        return of({
          message: isWin
            ? `🎉 Congrats ${data.username}, you won!`
            : `😢 Sorry ${data.username}, better luck next time.`,
          isWin,
          pointsDelta
        }).pipe(delay(500));
      })
    );
  }

  claimDaily(): Observable<{ message: string; pointsDelta: number }> {
  return this.http.post<{ message: string; pointsDelta: number }>(
    `${this.baseUrl}/daily`,
    {}
  );
}

}
