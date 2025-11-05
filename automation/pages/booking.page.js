import { firstVisible } from '../utils/loc.js';

export class BookingPage {
  constructor(page) { this.page = page; }

  async confirmTimezoneIfShown() {
    const modal = this.page.getByRole('dialog').filter({ hasText: /confirm your time zone/i });
    if (await modal.isVisible().catch(() => false)) {
      const confirmBtn = await firstVisible(this.page, [modal.getByRole('button', { name: /confirm/i }), 'button:has-text("Confirm")']);
      await confirmBtn.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async clickBookAScan() {
    const btn = await firstVisible(this.page, [this.page.getByRole('button', { name: /book a scan/i }), 'button[class*="book"][class*="scan"]', 'button.basic.mini-new.black-chocolate']);
    await btn.click();
  }

  async pickPackageByName(name) {
    const card = await firstVisible(this.page, [`[data-testid*="package"]:has-text("${name}")`, `[data-testid*="plan"]:has-text("${name}")`, `[role="group"]:has-text("${name}")`]);
    await card.click();
    const next = await firstVisible(this.page, [this.page.getByRole('button', { name: /continue/i }), 'button:has-text("Continue")']);
    await next.click();
  }

  async answerPreflightAllNo() {
    const dialog = this.page.getByRole('dialog').filter({ hasText: /please answer the following questions/i });
    if (!(await dialog.isVisible().catch(() => false))) return;
    const nos = dialog.getByRole('button', { name: /^no$/i });
    const count = await nos.count();
    for (let i = 0; i < count; i++) await nos.nth(i).click();
    const next = await firstVisible(this.page, [this.page.getByRole('button', { name: /continue/i }), 'button:has-text("Continue")']);
    await next.click();
  }

  async pickFirstClinic() {
    const card = await firstVisible(this.page, ['[data-testid*="location"]', '[role="group"]:has-text(",")']);
    await card.click();
    const next = await firstVisible(this.page, [this.page.getByRole('button', { name: /continue/i }), 'button:has-text("Continue")']);
    await next.click();
  }

  async pickAnyAvailableDateAndTime() {
    const day = await firstVisible(this.page, ['[role="gridcell"]:not([aria-disabled="true"])', '.calendar [aria-disabled="false"]']);
    await day.click();
    const time = await firstVisible(this.page, [this.page.getByRole('button', { name: /\d{1,2}:\d{2}\s?(am|pm)/i }), 'button:has-text("AM"), button:has-text("PM")']);
    await time.click();
    const next = await firstVisible(this.page, [this.page.getByRole('button', { name: /continue/i }), 'button:has-text("Continue")']);
    await next.click();
  }
}
