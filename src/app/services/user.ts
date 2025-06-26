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

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
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
      }
    }
  }

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

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.clearCurrentUser();
      }),
      catchError(error => {
        console.error('Logout error:', error);
        this.clearCurrentUser();
        throw error;
      })
    );
  }

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
