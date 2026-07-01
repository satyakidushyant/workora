# Refresh Token Mechanism

Because JWT Access Tokens in Workora have a very short lifespan (15 minutes), a **Refresh Token** mechanism is required to maintain user sessions without forcing them to re-enter their credentials.

## Storage and Delivery
- The refresh token is an opaque string (e.g., a securely generated random 64-byte string).
- It is stored in the database in the `RefreshTokens` table.
- **Security Rule**: The actual refresh token string is *never* stored in plaintext in the database. It is stored as a one-way hash (e.g., SHA-256). The API hashes the incoming token and compares it to the database record.

## Rotation Strategy
Workora uses **Refresh Token Rotation**. 
1. When a client uses `RefreshToken_A` to get a new access token, `RefreshToken_A` is immediately revoked in the database.
2. The server issues a new access token AND a new `RefreshToken_B`.
3. The client must replace `RefreshToken_A` with `RefreshToken_B` in its local storage/HTTP-only cookie.

## Reuse Detection (FR-AUTH-6)
Refresh Token Rotation is vulnerable if a token is stolen, as the attacker could use it to generate a new valid session. To mitigate this, Workora uses **Family Revocation**:
- Every time a refresh token is issued as part of a rotation, it shares the same `FamilyId` as its predecessor.
- If the server receives a request to refresh using a token that is *already revoked* (e.g., `RefreshToken_A` is used again), the server assumes a token theft has occurred.
- The server immediately revokes **all tokens** associated with that `FamilyId`.
- Both the legitimate user and the attacker are logged out and must re-authenticate with their password.
