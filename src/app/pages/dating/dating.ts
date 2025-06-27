import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevProfile, STATIC_PROFILES } from './static-profiles';

@Component({
  selector: 'app-dating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dating.html',
  styleUrls: ['./dating.css'],
})
export class Dating {
  profiles: DevProfile[] = [...STATIC_PROFILES];
  currentIndex: number = 0;
  liked: DevProfile[] = [];
  disliked: DevProfile[] = [];

  get currentProfile(): DevProfile | null {
    return this.profiles[this.currentIndex] ?? null;
  }

  swipeRight(): void {
    const profile = this.currentProfile;
    if (profile) {
      this.liked.push(profile);
      this.currentIndex++;
    }
  }

  swipeLeft(): void {
    const profile = this.currentProfile;
    if (profile) {
      this.disliked.push(profile);
      this.currentIndex++;
    }
  }
}
