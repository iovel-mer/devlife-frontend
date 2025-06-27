import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChallengeService {
  getChallenge(stack: string, level: string) {
    return of({ description: 'Write a function that returns the square of a number.' });
  }
}
