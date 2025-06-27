import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { phaserConfig } from './game.engine';

@Component({
  standalone: true,
  selector: 'app-bug-chase',
  templateUrl: './bug-chase.html',
  styleUrls: ['./bug-chase.css'],
  imports: [CommonModule],
})
export class BugChase implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngAfterViewInit(): Promise<void> {
  if (isPlatformBrowser(this.platformId)) {
    const Phaser = await import('phaser');
    const { phaserConfig } = await import('./game.engine');
    new Phaser.Game(phaserConfig);
  }
}

}
