import { test, expect } from '@playwright/test';
import { MemberPortalPage } from '../pages/member.portal.page.js';
import { BookingPage } from '../pages/booking.page.js';
import { USER, PWD } from '../utils/env.js';

test('happy path to payment screen', async ({ page }) => {
  const member = new MemberPortalPage(page);
  await member.signIn(USER, PWD);

  const booking = new BookingPage(page);
  await booking.confirmTimezoneIfShown();
  await booking.clickBookAScan();
  await booking.pickPackageByName('MRI Scan');
  await booking.answerPreflightAllNo();
  await booking.pickFirstClinic();
  await booking.pickAnyAvailableDateAndTime();

  await expect(page.getByRole('button', { name: /pay|confirm|complete/i })).toBeVisible();
});
