import { Injectable } from '@angular/core';
import { IApiClient } from '../../interfaces/api-client.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterModel } from '../../models/register';
import { User } from '../../models/user';
import { LoginModel } from '../../models/login';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService implements IApiClient {
  private apiUrl = 'https://localhost:5092/api';

  constructor(private http: HttpClient) {}

  Account = {
    // Login method

    login: (formValue: LoginModel): Observable<any> =>
      this.http.post<any>(`${this.apiUrl}/Account/login`, formValue),

    register: (formValue: RegisterModel): Observable<any> =>
      this.http.post<any>(`${this.apiUrl}/Account/register`, formValue),

    getUser: (userId: number): Observable<User> =>
      this.http.get<User>(`${this.apiUrl}/Account/Users/${userId}`),

    getUsers: (
      page: number,
      pageSize: number,
      search?: any,
      sort?: string,
      role?: string
    ): Observable<any> =>
      this.http.get<any>(
        `${this.apiUrl}/Account/users?page=${page}&pageSize=${pageSize}&sort=${sort}&search=${search}&role=${role}`
      ),

    updateProfile: (userId: number, data: Partial<User>): Observable<User> =>
      this.http.put<User>(`/api/account/users/${userId}`, data),

    logout: (): void => {
      // logic for logout (e.g., clear token)
    },
  };

  Dashboard = {
    getTools: (): Observable<any> =>
      this.http.get<any>(`${this.apiUrl}/Dashboard/Users/tools`),
  };
}
