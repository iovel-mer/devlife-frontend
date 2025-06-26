<<<<<<< HEAD
=======
// user.service.ts - Fixed version
>>>>>>> 14556de17e333e361ad227d71584c1e682aa569e
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface User {
  username: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  stack?: string;
  experience?: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  message?: string;
}

export interface RegisterResponse {
  success: boolean;
  user?: User;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api';
<<<<<<< HEAD

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

=======
  
  // Add BehaviorSubject for current user
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  // Public observables
>>>>>>> 14556de17e333e361ad227d71584c1e682aa569e
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
<<<<<<< HEAD
=======
    // Initialize from sessionStorage
>>>>>>> 14556de17e333e361ad227d71584c1e682aa569e
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
<<<<<<< HEAD
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        } catch (error) {
          console.error('Error parsing stored user:', error);
          sessionStorage.removeItem('currentUser');
        }
=======
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        sessionStorage.removeItem('currentUser');
>>>>>>> 14556de17e333e361ad227d71584c1e682aa569e
      }
    }
  }

<<<<<<< HEAD
=======
  // Login method
>>>>>>> 14556de17e333e361ad227d71584c1e682aa569e
  login(username: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username }, {
      withCredentials: true
    }).pipe(
      tap(response => {
        if (response.success && response.user) {
          this.setCurrentUser(response.user);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

<<<<<<< HEAD
=======
  // Register method - ეს იყო პრობლემა!
>>>>>>> 14556de17e333e361ad227d71584c1e682aa569e
  register(userData: User): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, userData, {
      withCredentials: true
    }).pipe(
      tap(response => {
        if (response.success && response.user) {
          this.setCurrentUser(response.user);
        }
      }),
      catchError(error => {
        console.error('Register error:', error);
        throw error;
      })
    );
  }

<<<<<<< HEAD
=======
  // Logout method
>>>>>>> 14556de17e333e361ad227d71584c1e682aa569e
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.clearCurrentUser();
      }),
      catchError(error => {
        console.error('Logout error:', error);
<<<<<<< HEAD
=======
        // Clear user even if logout fails
>>>>>>> 14556de17e333e361ad227d71584c1e682aa569e
        this.clearCurrentUser();
        throw error;
      })
    );
  }

<<<<<<< HEAD
  private setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  private clearCurrentUser(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('currentUser');
    }
  }

=======
  // Set current user - ეს method არ იყო!
  private setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  }

  // Clear current user - ეს method არ იყო!
  private clearCurrentUser(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    sessionStorage.removeItem('currentUser');
  }

  // Check authentication status with server (optional)
>>>>>>> 14556de17e333e361ad227d71584c1e682aa569e
  checkAuthStatus(): Observable<{ authenticated: boolean; user?: User }> {
    return this.http.get<{ authenticated: boolean; user?: User }>(`${this.apiUrl}/auth-status`, {
      withCredentials: true
    }).pipe(
      tap(response => {
        if (response.authenticated && response.user) {
          this.setCurrentUser(response.user);
        } else {
          this.clearCurrentUser();
        }
      }),
      catchError(error => {
        this.clearCurrentUser();
        throw error;
      })
    );
  }

<<<<<<< HEAD
=======
  // Getters for synchronous access
>>>>>>> 14556de17e333e361ad227d71584c1e682aa569e
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  get storedUsername(): string | null {
    const user = this.currentUser;
    return user ? user.username : null;
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 14556de17e333e361ad227d71584c1e682aa569e
