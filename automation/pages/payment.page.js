export class PaymentPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    // Stripe card iframe fields
    this.cardNumber = page.frameLocator('iframe[name^="__privateStripeFrame"]').locator('input[name="cardnumber"]');
    this.cardExpiry = page.frameLocator('iframe[name^="__privateStripeFrame"]').locator('input[name="exp-date"]');
    this.cardCvc = page.frameLocator('iframe[name^="__privateStripeFrame"]').locator('input[name="cvc"]');
    this.cardZip = page.frameLocator('iframe[name^="__privateStripeFrame"]').locator('input[name="postal"]');
    this.payBtn = page.getByRole('button', { name: /pay|confirm|complete/i });
    this.errorAlert = page.getByRole('alert').or(page.locator('[data-testid*="error"]'));
    this.successHeading = page.getByRole('heading', { name: /confirmed|success|thank you/i });
  }
  async fillCard({ number, exp, cvc, zip }) {
    await this.cardNumber.fill(number);
    await this.cardExpiry.fill(exp);
    await this.cardCvc.fill(cvc);
    if (zip) await this.cardZip.fill(zip);
  }
  async submit() {
    await this.payBtn.click();
    await this.page.waitForLoadState('networkidle');
  }
}
