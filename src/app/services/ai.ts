import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AiService {
  getRoast(code: string, output: string) {
    const msg = code.includes('return')
      ? 'ბრავო! ამ კოდს ჩემი ბებიაც დაწერდა, მაგრამ მაინც კარგია 🤓'
      : 'ეს კოდი ისე ცუდია, კომპილატორმა დეპრესია დაიწყო 😬';
    return of({ message: msg }).pipe(delay(800));
  }
}
