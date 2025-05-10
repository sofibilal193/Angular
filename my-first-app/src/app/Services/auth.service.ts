import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RegisterModel } from '../models/register';
import { LoginModel } from '../models/login';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://192.168.1.81:7171/api';
  private authToken: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorage: LocalStorageService
  ) {}

autoLogin(): Observable<any> {
  const token = this.localStorage.getAuthToken(); 
  if (!token) return of(null);

  return this.http.post<any>(`${this.apiUrl}/Auth/validate-token`, { token }).pipe(
    tap(user => {
      this.localStorage.setUser(JSON.stringify(user));
    }),
    catchError(err => {
      console.warn('Invalid or expired token', err);
      this.logout();
      return of(null);
    })
  );
}

  // Register method
  register(formValue: RegisterModel): Observable<any> {
    var response = this.http
      .post<any>(`${this.apiUrl}/Auth/register`, formValue)
      .pipe(catchError(this.handleError));
    return response;
  }

  // Login method
  login(formValue: LoginModel): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/Auth/login`, formValue)
      .pipe(catchError(this.handleError));
  }

  // Store the JWT token in localStorage or sessionStorage
  private storeToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.authToken = token;
  }

  // Logout method
  logout() {
    this.localStorage.clear();
    this.onRefresh();
    this.router.navigate(['/login']);
  }

  private async onRefresh() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    const currentUrl = this.router.url + '?';
    return this.router.navigateByUrl(currentUrl).then(() => {
      this.router.navigated = false;
      this.router.navigate([this.router.url]);
    });
  }

  // Optionally, you can add token validation to check if the token is still valid
  private handleError(error: any): Observable<never> {
    // Handle error (logging, user feedback, etc.)
    throw error;
  }
}
