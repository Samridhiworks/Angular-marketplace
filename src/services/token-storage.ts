import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenStorage {
  private readonly accessKey = 'accessToken';
  private readonly refreshKey = 'refreshToken';

  get accessToken(): string | null { return sessionStorage.getItem(this.accessKey); }
  get refreshToken(): string | null { return sessionStorage.getItem(this.refreshKey); }

  save(accessToken?: string, refreshToken?: string): void {
    if (accessToken) sessionStorage.setItem(this.accessKey, accessToken);
    if (refreshToken) sessionStorage.setItem(this.refreshKey, refreshToken);
  }

  clear(): void {
    sessionStorage.removeItem(this.accessKey);
    sessionStorage.removeItem(this.refreshKey);
  }
}
