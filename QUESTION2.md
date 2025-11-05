# Privacy Focused Integration Test

## Part 1: Integration test to prevent access to other members medical data

**Goal**: A signed in member must not be able to read or write another members medical questionnaire or related records, even if they can guess an id.  

**Given**: Member A is authenticated. Member B exists with a different member id.  
**When**: Member A tries to GET, POST, PUT, or PATCH medical questionnaire resources for Member B using direct id parameters.  
**Then**: The API returns 403 Forbidden and the response contains no sensitive fields. All attempts are logged with redaction.

**Preconditions**
- Auth uses scoped JWT or session containing subject member id.
- API checks both authentication and authorization with server side ownership checks.
- All endpoints use strict content type parsing and schema validation.

**Checks**
- GET /api/members/{B}/medical-questionnaire returns 403
- POST or PATCH to /api/members/{B}/medical-questionnaire returns 403
- No differential error messages that leak existence of Member B
- Audit log contains redacted attempt with requester id and purpose

## Part 2: HTTP request examples

Replace tokens and ids accordingly.

```http
# Member A signs in and gets session or JWT
POST https://staging-hub.ezra.com/api/auth/login
Content-Type: application/json

{ "email": "memberA@example.com", "password": "secret" }

# Attempt to read another members questionnaire
GET https://staging-hub.ezra.com/api/members/12345/medical-questionnaire
Authorization: Bearer <token-for-member-A>
Accept: application/json

# Expected: 403 Forbidden, body like { "error": "forbidden" }

# Attempt to update another members questionnaire
PATCH https://staging-hub.ezra.com/api/members/12345/medical-questionnaire
Authorization: Bearer <token-for-member-A>
Content-Type: application/json

{ "answers": [{ "questionId": "q1", "value": "No" }] }

# Expected: 403 Forbidden
```

Also test an **in scope** request to verify control:

```http
GET https://staging-hub.ezra.com/api/members/<A>/medical-questionnaire
Authorization: Bearer <token-for-member-A>
Accept: application/json

# Expected: 200 OK with only Member A data
```

## Part 3: Managing security quality for many sensitive endpoints

**Approach**
- Data classification and threat modeling for each endpoint category
- Centralized authn and authz via API gateway with consistent policies
- Strong input validation with allowlists and JSON schema, reject by default
- Output filtering and data minimization, never return unnecessary fields
- Idempotency keys on write endpoints and replay protection
- Rate limiting and bot controls per user and IP
- End to end TLS and strict security headers
- Secrets management with rotation and least privilege service accounts
- Observability: structured logs with redaction, metrics, anomaly alerts
- Automated security tests in CI: SAST, dependency scanning, lint rules that block unsafe patterns, and integration tests for IDOR, SSRF, SQLi, and auth bypass
- Regular DAST against staging with production like configs and mocked third parties
- Continuous review: security champions, mandatory code review templates, and API change checklists

**Tradeoffs and risks**
- Central gateway adds complexity and potential single point of failure, mitigated with HA and circuit breakers
- Strict validations may cause false positives that slow delivery, mitigated with clear error contracts and feature flags
- Extensive logging can risk PII exposure if not redacted, require log governance and sampling
- Rate limits can degrade UX for power users, provide token buckets and allow lists where justified
- Automated scanners can create noise, tune rules and add allow lists with expiration
