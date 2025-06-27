import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-analyze-code',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analyze-code.html',
  styleUrls: ['./analyze-code.css'],
})
export class AnalyzeCode {
  username: string = '';
  repoList: string[] = [];
  selectedRepo: string = '';
  analysisResult: {
    type: string;
    strengths: string[];
    weaknesses: string[];
    celebrity: string;
  } | null = null;

  // 👉 Step 1: Load repositories (called when user clicks "Load Repositories")
  analyzeRepository(): void {
    if (!this.username.trim()) return;

    // Mock repository list (in future, call GitHub API)
    this.repoList = [
      'devlife-backend',
      'devlife-frontend',
      'code-roaster',
      'bug-chase',
    ];

    // Reset previous selection and result
    this.selectedRepo = '';
    this.analysisResult = null;
  }

  // 👉 Step 2: Perform fake analysis (called when user clicks "Analyze Repository")
  performAnalysis(): void {
    if (!this.selectedRepo) return;

    // Mock result (in future, will come from backend AI)
    this.analysisResult = {
      type: 'Chaotic Debugger',
      strengths: ['Creative problem solver', 'Fast coder'],
      weaknesses: ['Unclear commit messages', 'No documentation'],
      celebrity: 'Mr. Robot',
    };
  }
}
