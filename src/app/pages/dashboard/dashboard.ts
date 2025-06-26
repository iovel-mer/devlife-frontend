import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,RouterModule],
   standalone:true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
username: string | null = null;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'] || null;
    });
  }
}
