import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { RegisterModel } from '../../models/register';
import { LocalStorageService } from '../local-storage.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginModel } from '../../models/login';
import { User } from '../../models/user';
import { ApiClientService } from '../apiClient/api-client.service';
import { LoggedInUser } from '../../models/loggedInUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedInUser: LoggedInUser = {
    userId: 0,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    roles: [],
    isLoggedIn: false,
  };

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    private jwtHelper: JwtHelperService,
    private apiClient: ApiClientService
  ) {}

  async init(): Promise<void> {
    debugger;
    const token = this.localStorage.getAuthToken();
    if (token) {
      const tokenUser = this.extractToken();
      if (tokenUser) {
        try {
          const user = await firstValueFrom(
            this.GetUserAsync(tokenUser.userId)
          );
          this.loggedInUser = {
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            roles: user.roles,
            isLoggedIn: true,
          };
        } catch (err) {
          console.error('Failed to fetch user:', err);
          this.router.navigate(['/login']);
        }
      } else {
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  isAuthenticated(): boolean {
    return this.loggedInUser.isLoggedIn;
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

  // Get User by Id
  GetUserAsync(userId: number): Observable<User> {
    return this.apiClient.Account.getUser(userId).pipe(
      catchError(this.handleError)
    );
  }

  // Paged List of Users
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
    console.error('API Error:', error);
    // Optionally: show user-friendly messages using a toast or alert service
    return throwError(() => error);
  }

  extractToken(): LoggedInUser | null {
    let token = this.localStorage.getAuthToken();

    if (token && this.jwtHelper.isTokenExpired(token)) {
      return null;
    }

    let decodedToken = this.jwtHelper.decodeToken(token);
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
    // this.loggedInUser.role =
    //   decodedToken[
    //     'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
    //   ];
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
