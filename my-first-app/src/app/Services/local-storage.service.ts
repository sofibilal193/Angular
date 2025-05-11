import { Injectable } from '@angular/core';
import { GlobalConstants } from '../common/globalConstants';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  // Services
  setUser(user: string) {
    return localStorage.setItem(GlobalConstants.USER_KEY, user);
  }

  getUser() {
    return localStorage.getItem(GlobalConstants.USER_KEY);
  }

  setAuthToken(data: string) {
    return localStorage.setItem(GlobalConstants.TOKEN_KEY, data);
  }

  getAuthToken() {
    return localStorage.getItem(GlobalConstants.TOKEN_KEY) ?? null;
  }

  clear() {
    localStorage.clear();
  }

  //#endregion
}
