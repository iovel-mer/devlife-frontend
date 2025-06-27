import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class JudgeService {
  runCode(code: string) {
    return of({ output: '25' }); // მაგალითად უბრალოდ აბრუნებს შედეგს
  }
}
