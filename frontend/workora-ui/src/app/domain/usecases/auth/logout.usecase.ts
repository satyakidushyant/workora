import { Observable } from 'rxjs';
import { IAuthRepository } from '../../repositories/i-auth.repository';
import { OperationResult } from '../../models/auth.model';

/**
 * Use case encapsulating user logout business logic.
 */
export class LogoutUseCase {
  /**
   * Initializes a new instance of the LogoutUseCase class.
   *
   * @param authRepository Authentication repository contract.
   */
  constructor(private readonly authRepository: IAuthRepository) {}

  /**
   * Executes session revocation and user logout.
   *
   * @param refreshToken Refresh token to invalidate.
   * @returns Observable emitting operation result details.
   */
  execute(refreshToken: string): Observable<OperationResult> {
    return this.authRepository.logout(refreshToken);
  }
}
