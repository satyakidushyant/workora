import { Observable } from 'rxjs';
import { IAuthRepository } from '../../repositories/i-auth.repository';
import { UserProfile } from '../../models/auth.model';

/**
 * Use case encapsulating user profile retrieval business logic.
 */
export class GetProfileUseCase {
  /**
   * Initializes a new instance of the GetProfileUseCase class.
   *
   * @param authRepository Authentication repository contract.
   */
  constructor(private readonly authRepository: IAuthRepository) {}

  /**
   * Executes user profile retrieval.
   *
   * @returns Observable emitting user profile details.
   */
  execute(): Observable<UserProfile> {
    return this.authRepository.getMyProfile();
  }
}
