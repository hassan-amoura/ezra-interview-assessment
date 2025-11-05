# ezra-interview-assessment

This project automates the core parts of Ezra’s member booking flow using **Playwright**, built with a **Page Object Model (POM)** structure.  
It’s designed to look and feel like real-world, maintainable test automation that could scale into production.

## Overview

The goal was to cover 2–3 of the most critical test cases from the booking flow. These include:

1. Signing in as a member and starting a booking  
2. Completing the booking steps up to the payment screen  
3. Testing payment outcomes (successful and declined transactions)

This setup demonstrates not just test coverage but also architecture, readability, and design decisions that matter when building long-term automation frameworks.

## Automated Test Scenarios

### 1. Happy Path Booking
Covers the main user flow:
- Log in to the member portal  
- Accept cookie banner if present  
- Click “Book a Scan”  
- Select scan plan  
- Fill DOB and sex  
- Select location and date/time  
- Proceed to payment screen  

### 2. Successful Payment
Simulates a user paying successfully with a Stripe test card.  
Validates that the system confirms the booking and shows a success state.

### 3. Declined Payment
Uses a Stripe test card that fails.  
Confirms that the application handles errors gracefully and displays the correct failure message.

## Project Structure
automation/
pages/
signin.page.js
member.portal.page.js
booking.page.js
payment.page.js
tests/
happy.path.spec.js
booking.success.spec.js
booking.declined.spec.js
utils/
loc.js
playwright.config.js
package.json
README.md
TESTCASES.md
QUESTION2.md
webhook-testcase.md

## Setup and Running the Tests

### Requirements
- Node.js version 18 or higher  
- macOS or Linux (Windows WSL works fine too)

### Install dependencies

npm ci
npx playwright install --with-deps

Environment file

Create a .env.local file in the root of the project and add:

 - BASE_URL=https://myezra-staging.ezra.com
 - HUB_URL=https://staging-hub.ezra.com/sign-in
 - USER_EMAIL=hassan.amoura+test@gmail.com
 - USER_PASSWORD=Tester1!

**Run everything:**

npm test

**Run in headed mode for debugging:**

npx playwright test --headed

**View a test report:**

npx playwright show-report

**Open a trace file from a failed run:**

npx playwright show-trace test-results/**/trace.zip

**Run one specific test:**

npx playwright test tests/happy.path.spec.js

**Trade-offs and Assumptions**

 - The cookie consent banner appears on multiple pages and can block clicks.
   Tests include logic to detect and accept it before continuing.

 - Some elements (like “Book a Scan”) have no visible text, so locators rely on roles, classes, or structure.

 - Slightly longer waits were added for Stripe iframe loads to make tests more reliable.

 - The staging credentials are test-only and not sensitive.

 - Scalability and Future Improvements

 - If this project were extended into a full automation suite:

**Parallelization:**
Configure Playwright to run tests in parallel across browsers and environments.

**Data-driven testing:**
Replace hardcoded credentials and form data with fixtures or environment-specific config files.

**Environment management:**
Integrate environment switching (staging, dev, prod) through CLI parameters.

**Reporting and CI/CD:**
Connect Playwright reports to a CI pipeline (GitHub Actions or Jenkins).
This would automatically run the suite after every merge or deployment.

**Mocking APIs:**
Use network interception to mock backend calls for faster and more predictable test results.

**Reusable test data and fixtures:**
Implement structured test data layers to simplify onboarding new testers and maintainers.

**Notes on Design Decisions**

The project uses a Page Object Model (POM) pattern to keep logic separate:

Each page has its own file in automation/pages/

Tests read almost like plain English (booking.pickPackageByName(), booking.selectFirstLocationCard())

Utilities (loc.js) provide small shared helpers to find visible elements and reduce locator duplication.

This approach keeps tests short, reusable, and easy to scale when more features or pages are added later.

Cookie Banner Finding Summary

During the automation, the “Book a Scan” step consistently failed due to the Termly cookie consent banner overlapping the page.
This was fixed by handling the banner in both the sign-in and member pages and by seeding a long-lived consent cookie during test setup.
Details are documented in TESTCASES.md (Test ID: WEB-BOOK-001).

Example Command Flow (for reviewers)
# install everything
npm ci
npx playwright install --with-deps

# run main flow with browser visible
npx playwright test tests/happy.path.spec.js --headed --trace on

# show results
npx playwright show-report

**Author Notes**
This submission demonstrates a realistic automation framework:

Uses Playwright with good architecture

Handles flaky UI elements and popups

Balances maintainability with simplicity

Includes documentation, trade-offs, and scalability plans

If this were expanded into a full QA suite, I’d focus next on running these tests in CI and adding API-level validation to strengthen coverage.
