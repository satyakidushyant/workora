import { Injectable } from '@angular/core';

/**
 * Service managing storage and retrieval of authentication tokens in client storage.
 */
@Injectable({
  providedIn: 'root'
})
export class TokenService {
  /**
   * Local storage key identifier for the JWT Access Token.
   */
  private readonly ACCESS_TOKEN_KEY = 'workora_access_token';

  /**
   * Local storage key identifier for the Refresh Token.
   */
  private readonly REFRESH_TOKEN_KEY = 'workora_refresh_token';

  /**
   * Retrieves the stored JWT Access Token.
   *
   * @returns Stored access token string or null if absent.
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Saves the JWT Access Token to local storage.
   *
   * @param token Access token string to store.
   */
  setAccessToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  /**
   * Retrieves the stored Refresh Token.
   *
   * @returns Stored refresh token string or null if absent.
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Saves the Refresh Token to local storage.
   *
   * @param token Refresh token string to store.
   */
  setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  /**
   * Clears both Access Token and Refresh Token from client storage.
   */
  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Checks whether an Access Token exists in storage.
   *
   * @returns True if access token exists, false otherwise.
   */
  hasAccessToken(): boolean {
    return !!this.getAccessToken();
  }
}
