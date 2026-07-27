import { Observable } from 'rxjs';
import { IAuthRepository } from '../../repositories/i-auth.repository';
import { ResetPasswordParams, OperationResult } from '../../models/auth.model';

/**
 * Use case encapsulating reset password token confirmation logic.
 */
export class ResetPasswordUseCase {
  /**
   * Initializes a new instance of the ResetPasswordUseCase class.
   *
   * @param authRepository Authentication repository contract.
   */
  constructor(private readonly authRepository: IAuthRepository) {}

  /**
   * Executes password update with reset token.
   *
   * @param params Reset token and new password credentials.
   * @returns Observable emitting operation result summary.
   */
  execute(params: ResetPasswordParams): Observable<OperationResult> {
    return this.authRepository.resetPassword(params);
  }
}
