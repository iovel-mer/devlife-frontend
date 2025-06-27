import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-escape-meeting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './escape-meeting.html',
})
export class EscapeMeeting {
  categories = ['Daily standup', 'Sprint planning', 'Client meeting', 'Team building'];
  excuseTypes = ['Technical', 'Personal', 'Creative'];

  selectedCategory = '';
  selectedType = '';
  generatedExcuse = '';
  believabilityScore = 0;
  favorites: string[] = [];

  generateExcuse() {
    // Placeholder template - change later to call backend API
    const excuses = {
      Technical: ['სერვერს ცეცხლი გაუჩნდა', 'VPN გასკდა'],
      Personal: ['კატამ production-ში შეაღწია', 'ბებია Zoom-ზე დამეჯდა'],
      Creative: ['AI-მ consciousness შეიძინა და დახმარება სჭირდება'],
    };

    const random = excuses[this.selectedType as keyof typeof excuses];
    const excuse = random[Math.floor(Math.random() * random.length)];
    this.generatedExcuse = excuse;
    this.believabilityScore = Math.floor(Math.random() * 100);
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.generatedExcuse);
  }

  addToFavorites() {
    if (this.generatedExcuse && !this.favorites.includes(this.generatedExcuse)) {
      this.favorites.push(this.generatedExcuse);
    }
  }
}
