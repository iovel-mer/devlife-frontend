// user.service.ts - Fixed version
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
  
  // Add BehaviorSubject for current user
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  // Public observables
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    // Initialize from sessionStorage
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
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
    }
  }

  // Login method
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

  // Register method - ეს იყო პრობლემა!
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

  // Logout method
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.clearCurrentUser();
      }),
      catchError(error => {
        console.error('Logout error:', error);
        // Clear user even if logout fails
        this.clearCurrentUser();
        throw error;
      })
    );
  }

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

  // Getters for synchronous access
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
}