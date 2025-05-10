import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RegisterModel } from '../models/register';
import { LoginModel } from '../models/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://192.168.1.81:7171/api'; 
  private authToken: string | null = null; 

constructor(
    private http:HttpClient,
  ) { }
  
  // Register method
  register(formValue: RegisterModel): Observable<any> {
    var response = this.http.post<any>(`${this.apiUrl}/Auth/register`, formValue).pipe(
      catchError(this.handleError)
    );
    return response;
  }

   // Login method
  login(formValue: LoginModel): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Auth/login`, formValue).pipe(
      catchError(this.handleError)
    );
  }

  // Store the JWT token in localStorage or sessionStorage
  private storeToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.authToken = token;
  }

  // Retrieve the JWT token from localStorage
  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Remove the JWT token from localStorage
  private removeToken(): void {
    localStorage.removeItem('authToken');
    this.authToken = null;
  }

  // Logout method
  logout(): void {
    this.removeToken();
  }

  // Check if the user is authenticated (if the token exists and is valid)
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? true : false;
  }

  // Optionally, you can add token validation to check if the token is still valid
  private handleError(error: any): Observable<never> {
    // Handle error (logging, user feedback, etc.)
    throw error;
  }
}
