import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { RegisterModel } from '../../models/register';
import { LocalStorageService } from '../local-storage.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoggedInUser } from '../../models/loggedInUser';
import { LoginModel } from '../../models/login';
import { User } from '../../models/user';
import { ApiClientService } from '../apiClient/api-client.service';

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

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    private jwtHelper: JwtHelperService,
    private apiClient: ApiClientService
  ) {}

  isAuthenticated(): Boolean {
    return this.loggedInUser.isLoggedIn;
  }

  autoLogin(): Observable<User | null> {
    const token = this.localStorage.getAuthToken();
    if (!token) return of(null);

    const newUserId = this.userDetailFromToken()?.userId;
    if (newUserId == null || isNaN(newUserId)) return of(null);

    return this.GetUserAsync(newUserId);
  }

  // Register method
  register(formValue: RegisterModel): Observable<any> {
    return this.apiClient.Account.register(formValue).pipe(
      catchError(this.handleError)
    );
  }

  // Login method
  loginUserAsync(formValue: LoginModel): Observable<any> {
    return this.apiClient.Account.login(formValue).pipe(
      catchError(this.handleError)
    );
  }

  GetUserAsync(userId: number): Observable<User> {
    return this.apiClient.Account.getUser(userId).pipe(
      catchError(this.handleError)
    );
  }

  async GetUsers(
    page: number,
    pageSize: number,
    search?: any,
    sortColumn?: string,
    role?: string,
    sortDirection?: string
  ): Promise<Observable<any>> {
    var sort = sortDirection === 'asc' ? sortColumn : '-' + sortColumn;
    return this.apiClient.Account.getUsers(
      page,
      pageSize,
      search,
      sort,
      role
    ).pipe(catchError(this.handleError));
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

  userDetailFromToken(): LoggedInUser | null {
    this.loggedInUser.token = this.localStorage.getAuthToken();

    if (
      this.loggedInUser.token &&
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
