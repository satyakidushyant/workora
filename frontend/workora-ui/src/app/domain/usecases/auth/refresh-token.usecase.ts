import { Observable } from 'rxjs';
import { IAuthRepository } from '../../repositories/i-auth.repository';
import { AuthTokens } from '../../models/auth.model';

/**
 * Use case encapsulating token refresh business logic.
 */
export class RefreshTokenUseCase {
  /**
   * Initializes a new instance of the RefreshTokenUseCase class.
   *
   * @param authRepository Authentication repository contract.
   */
  constructor(private readonly authRepository: IAuthRepository) {}

  /**
   * Executes access token renewal using refresh token.
   *
   * @param refreshToken Refresh token string.
   * @returns Observable emitting updated authentication tokens.
   */
  execute(refreshToken: string): Observable<AuthTokens> {
    return this.authRepository.refreshToken(refreshToken);
  }
}
