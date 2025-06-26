import { bootstrapApplication } from '@angular/platform-browser';
<<<<<<< HEAD
import { provideHttpClient, withFetch } from '@angular/common/http';
=======
import { provideHttpClient } from '@angular/common/http';
>>>>>>> 14556de17e333e361ad227d71584c1e682aa569e
import { provideRouter } from '@angular/router';


import { App } from './app/app';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [
<<<<<<< HEAD
    provideHttpClient(withFetch()),       
=======
    provideHttpClient(),       
>>>>>>> 14556de17e333e361ad227d71584c1e682aa569e
    provideRouter(routes),
  ]
});
