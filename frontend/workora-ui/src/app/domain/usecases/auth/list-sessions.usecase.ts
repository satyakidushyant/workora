import { Observable } from 'rxjs';
import { IAuthRepository } from '../../repositories/i-auth.repository';
import { UserSession } from '../../models/auth.model';

/**
 * Use case encapsulating session list retrieval business logic.
 */
export class ListSessionsUseCase {
  /**
   * Initializes a new instance of the ListSessionsUseCase class.
   *
   * @param authRepository Authentication repository contract.
   */
  constructor(private readonly authRepository: IAuthRepository) {}

  /**
   * Executes active session listing for current user.
   *
   * @returns Observable emitting list of user sessions.
   */
  execute(): Observable<UserSession[]> {
    return this.authRepository.listMySessions();
  }
}
