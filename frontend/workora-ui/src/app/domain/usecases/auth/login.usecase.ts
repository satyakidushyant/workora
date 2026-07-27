import { Observable } from 'rxjs';
import { IAuthRepository } from '../../repositories/i-auth.repository';
import { AuthTokens, LoginCredentials } from '../../models/auth.model';

/**
 * Use case encapsulating user login business logic.
 */
export class LoginUseCase {
  /**
   * Initializes a new instance of the LoginUseCase class.
   *
   * @param authRepository Authentication repository contract.
   */
  constructor(private readonly authRepository: IAuthRepository) {}

  /**
   * Executes the login process.
   *
   * @param credentials User email and password.
   * @returns Observable emitting authentication tokens.
   */
  execute(credentials: LoginCredentials): Observable<AuthTokens> {
    return this.authRepository.login(credentials);
  }
}
