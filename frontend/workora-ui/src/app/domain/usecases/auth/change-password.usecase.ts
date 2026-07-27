import { Observable } from 'rxjs';
import { IAuthRepository } from '../../repositories/i-auth.repository';
import { ChangePasswordParams, OperationResult } from '../../models/auth.model';

/**
 * Use case encapsulating password change business logic.
 */
export class ChangePasswordUseCase {
  /**
   * Initializes a new instance of the ChangePasswordUseCase class.
   *
   * @param authRepository Authentication repository contract.
   */
  constructor(private readonly authRepository: IAuthRepository) {}

  /**
   * Executes password update for authenticated user.
   *
   * @param params Current password and new password credentials.
   * @returns Observable emitting operation result summary.
   */
  execute(params: ChangePasswordParams): Observable<OperationResult> {
    return this.authRepository.changePassword(params);
  }
}
