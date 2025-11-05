export class SignInPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByLabel(/email/i).or(page.locator('input[type="email"]'));
    this.pwdInput = page.getByLabel(/password/i).or(page.locator('input[type="password"]'));
    this.submitBtn = page.getByRole('button', { name: /sign in|log in/i });
  }
  async goto() {
    await this.page.goto('https://staging-hub.ezra.com/sign-in/');
  }
  async signIn(email, pwd) {
    await this.emailInput.fill(email);
    await this.pwdInput.fill(pwd);
    await this.submitBtn.click();
    await this.page.waitForLoadState('networkidle');
  }
}
