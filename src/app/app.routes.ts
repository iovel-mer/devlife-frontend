import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register').then((m) => m.Register),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
    
  },
  {
    path: 'casino',
    loadComponent: () =>
      import('./pages/casino/casino').then((m) => m.Casino),
  },
  {
    path: 'roast',
    loadComponent: () =>
      import('./pages/roast/roast').then((m) => m.Roast),
  },
  {
    path: 'bug-chase',
    loadComponent: () =>
      import('./pages/bug-chase/bug-chase').then((m) => m.BugChase),
  },
  {
    path: 'analyze-code',
    loadComponent: () =>
      import('./pages/analyze-code/analyze-code').then((m) => m.AnalyzeCode),
  },
  {
    path: 'dating',
    loadComponent: () =>
      import('./pages/dating/dating').then((m) => m.Dating),
  },
  {
    path: 'escape-meeting',
    loadComponent: () =>
      import('./pages/escape-meeting/escape-meeting').then((m) => m.EscapeMeeting),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
