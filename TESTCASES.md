# Booking Flow Test Suite

This list orders the top fifteen booking flow test cases by risk to the business and likelihood of failure, based on the first three steps of booking including payment.

1. End to end booking success using Stripe happy path card 4242 with receipt created and correct amount
2. Payment fails with declined card and booking does not get created
3. Payment form blocks expired card and surfaces clear error
4. Prevent duplicate charging on double click or page refresh during payment confirmation
5. Session availability hold prevents race conditions when two users pick the same slot
6. Pricing total and taxes are accurate through plan selection to payment confirmation
7. Client side and server side validation enforces required fields before payment
8. Idempotent payment intents ensure no duplicate charges when webhook retries occur
9. Network error during payment gracefully retries or resumes without charge
10. Stripe 3DS challenge succeeds and booking completes
11. Stripe 3DS challenge fails or is abandoned and booking remains unconfirmed
12. Currency and locale display are correct for the user account
13. Refund or cancellation path restores inventory and does not leave dangling bookings
14. Access control prevents non authenticated users from reaching payment step
15. Analytics and audit events are emitted for key milestones without leaking PII

## Top three explanations

1. **End to end booking success**  
   This is the money path. If this breaks, revenue stops. It validates integration points across auth, inventory, pricing, and Stripe payment confirmation in a single flow.

2. **Declined card handling**  
   Declines are common in real life. The system must prevent partial state writes, avoid creating bookings, and provide clear recovery steps to the user.

3. **Expired card validation**  
   This catches a high frequency validation issue early, reducing support burden and preventing unnecessary calls to Stripe that waste time and cost.

