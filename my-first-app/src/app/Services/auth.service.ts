import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RegisterModel } from '../models/register';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoggedInUser } from '../models/loggedInUser';
import { LoginModel } from '../models/login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedInUser: LoggedInUser = {
    name: '',
    surname: '',
    userName: '',
    role: null,
    roles: [],
    token: null,
    isLoggedIn: false,
    userId: 0,
    email: '',
  };

  private apiUrl = 'https://localhost:5092/api';

  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorage: LocalStorageService,
    private jwtHelper: JwtHelperService
  ) {}

  // autoLogin(): Observable<any> {
  //   const token = this.localStorage.getAuthToken();
  //   if (!token) return of(null);

  //   return this.http
  //     .post<any>(`${this.apiUrl}/Auth/validate-token`, { token })
  //     .pipe(
  //       tap((user) => {
  //         this.localStorage.setUser(JSON.stringify(user));
  //       }),
  //       catchError((err) => {
  //         console.warn('Invalid or expired token', err);
  //         this.logout();
  //         return of(null);
  //       })
  //     );
  // }

  // Register method
  register(formValue: RegisterModel): Observable<any> {
    var response = this.http
      .post<any>(`${this.apiUrl}/Account/register`, formValue)
      .pipe(catchError(this.handleError));
    return response;
  }

  // Login method
  login(formValue: LoginModel): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/Account/login`, formValue)
      .pipe(catchError(this.handleError));
  }

  // Register method
  GetUserAsync(userId: number): Observable<any> {
    var response = this.http
      .get<any>(`${this.apiUrl}/Account/Users/${userId}`)
      .pipe(catchError(this.handleError));
    return response;
  }

  // Register method
  async GetUsers(
    page: number,
    pageSize: number,
    search?: any,
    sortColumn?: string,
    role?: string,
    sortDirection?: string
  ): Promise<Observable<any>> {
    var sort = sortDirection === 'asc' ? sortColumn : '-' + sortColumn;
    var response = this.http
      .get<any>(
        `${this.apiUrl}/Account/users?page=${page}&pageSize=${pageSize}&sort=${sort}&search=${search}&role=${role}`
      )
      .pipe(catchError(this.handleError));
    return response;
  }

  // Store the JWT token in localStorage or sessionStorage
  private storeToken(token: string): void {
    localStorage.setItem('authToken', token);
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
    throw error;
  }

  isAuthenticated() {
    if (this.localStorage.getAuthToken()) {
      return true;
    } else {
      return false;
    }
  }

  userDetailFromToken(): LoggedInUser | null {
    this.loggedInUser.token = this.localStorage.getAuthToken();

    if (
      this.loggedInUser.token ||
      this.jwtHelper.isTokenExpired(this.loggedInUser.token)
    ) {
      return null;
    }

    let decodedToken = this.jwtHelper.decodeToken(this.loggedInUser.token);
    // let name =
    //   decodedToken[
    //     'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
    //   ];
    // this.name = name.split(' ')[0];
    // let surname =
    //   decodedToken[
    //     'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
    //   ];
    // this.surname = surname.split(' ')[1];
    this.loggedInUser.roles =
      decodedToken[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ];
    this.loggedInUser.role =
      decodedToken[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ];
    this.loggedInUser.userId = parseInt(
      decodedToken[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ]
    );
    this.loggedInUser.email =
      decodedToken[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
      ];
    // this.userName = name.split(' ')[0] + ' ' + surname.split(' ')[1];

    return this.loggedInUser;
  }
}
