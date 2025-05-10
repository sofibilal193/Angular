import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private _authUserKey = 'AuthUserKey-';
  private _authTokenKey = 'AuthTokenKey-';

  constructor() {}

  // Services
  setUser(user:string) {
    return localStorage.setItem(this._authUserKey,user);
  }

   getUser() {
    return localStorage.getItem(this._authUserKey);
  }

  setAuthToken(user:string) {
    return localStorage.setItem(this._authTokenKey,user);
  }

   getAuthToken() {
    return localStorage.getItem(this._authTokenKey);
  }

  clear() {
    localStorage.clear();
  }

  //#endregion
}
