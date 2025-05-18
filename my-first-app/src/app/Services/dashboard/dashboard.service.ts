import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from '../../models/user';
import { ApiClientService } from '../apiClient/api-client.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private apiClient: ApiClientService) {}

  GetToolsAsync(): Observable<User> {
    return this.apiClient.Dashboard.getTools().pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => error);
  }
}
