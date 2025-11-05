import { test, expect } from '@playwright/test';
import { creds } from '../utils/env.js';
import { SignInPage } from '../pages/signin.page.js';
import { BookingPage } from '../pages/booking.page.js';
import { PaymentPage } from '../pages/payment.page.js';

test('Booking fails gracefully for card declined by issuer', async ({ page }) => {
  const { user, pwd } = creds();

  const signIn = new SignInPage(page);
  await signIn.goto();
  await signIn.signIn(user, pwd);

  const booking = new BookingPage(page);
  await booking.start();
  await booking.choosePlan();
  await booking.pickFirstAvailableSlot();

  const payment = new PaymentPage(page);
  await payment.fillCard({
    number: '4000 0000 0000 0002', // Stripe test card number for generic decline
    exp: '12 / 34',
    cvc: '222',
    zip: '10001'
  });
  await payment.submit();

  await expect(payment.errorAlert).toBeVisible();
  await expect(payment.errorAlert).toContainText(/declined|failed|cannot|unable/i);
});
