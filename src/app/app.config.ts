import { ApplicationConfig } from '@angular/core';
<<<<<<< HEAD
import { provideHttpClient, withFetch } from '@angular/common/http';
=======
import { provideHttpClient } from '@angular/common/http';
>>>>>>> 14556de17e333e361ad227d71584c1e682aa569e
import { provideRouter } from '@angular/router';


import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
<<<<<<< HEAD
    provideHttpClient(withFetch()),         
=======
    provideHttpClient(),         
>>>>>>> 14556de17e333e361ad227d71584c1e682aa569e
    provideRouter(routes),       
  ],
};
