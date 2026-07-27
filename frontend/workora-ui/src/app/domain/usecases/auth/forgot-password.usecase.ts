import { Observable } from 'rxjs';
import { IAuthRepository } from '../../repositories/i-auth.repository';
import { ForgotPasswordParams, OperationResult } from '../../models/auth.model';

/**
 * Use case encapsulating forgot password notification logic.
 */
export class ForgotPasswordUseCase {
  /**
   * Initializes a new instance of the ForgotPasswordUseCase class.
   *
   * @param authRepository Authentication repository contract.
   */
  constructor(private readonly authRepository: IAuthRepository) {}

  /**
   * Executes password reset email request.
   *
   * @param params Account email parameters.
   * @returns Observable emitting operation result summary.
   */
  execute(params: ForgotPasswordParams): Observable<OperationResult> {
    return this.authRepository.forgotPassword(params);
  }
}
