import { test, expect } from '@playwright/test';
import { creds } from '../utils/env.js';
import { SignInPage } from '../pages/signin.page.js';
import { BookingPage } from '../pages/booking.page.js';
import { PaymentPage } from '../pages/payment.page.js';

test('End to end booking with successful Stripe payment', async ({ page }) => {
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
    number: '4242 4242 4242 4242',
    exp: '12 / 34',
    cvc: '123',
    zip: '10001'
  });
  await payment.submit();

  await expect(payment.successHeading).toBeVisible({ timeout: 20000 });
});
