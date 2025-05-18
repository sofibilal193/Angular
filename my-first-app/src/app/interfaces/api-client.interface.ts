import { Observable } from 'rxjs';
import { User } from '../models/user';
import { RegisterModel } from '../models/register';
import { LoginModel } from '../models/login';

export interface IApiClient {
  Account: {
    login(formValue: LoginModel): Observable<any>;
    register(formValue: RegisterModel): Observable<any>;
    getUser(userId: number): Observable<User>;
    updateProfile(userId: number, data: Partial<User>): Observable<User>;
    logout(): void;
  };
  Dashboard: {
    getTools(): Observable<any>;
  };
}
