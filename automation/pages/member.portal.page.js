import { firstVisible } from '../utils/loc.js';

export class MemberPortalPage {
  constructor(page) { this.page = page; }

  async gotoHome() {
    await this.page.goto('https://myezra-staging.ezra.com/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async signIn(email, pwd) {
    await this.gotoHome();
    const emailInput = await firstVisible(this.page, ['input[type="email"]', 'input[name*="email"]']);
    const pwdInput = await firstVisible(this.page, ['input[type="password"]', 'input[name*="password"]']);
    await emailInput.fill(email);
    await pwdInput.fill(pwd);
    const submit = await firstVisible(this.page, ['form button[type="submit"]', 'button[class*="submit"]']);
    await submit.click().catch(() => {});
    if ((await this.page.url()).includes('/sign-in')) { await pwdInput.press('Enter'); }
    await this.page.waitForLoadState('networkidle');
  }

  async signUp(email, pwd) {
    await this.gotoHome();
    const signupLink = await firstVisible(this.page, [this.page.getByRole('link', { name: /sign up|create account|register/i }), 'a[href*="sign-up"], a[href*="register"]']).catch(() => null);
    if (signupLink) await signupLink.click().catch(() => {});
    const emailInput = await firstVisible(this.page, ['input[type="email"]', 'input[name*="email"]']);
    const pwdInput = await firstVisible(this.page, ['input[type="password"]', 'input[name*="password"]']);
    const confirm = this.page.locator('input[name*="confirm"], input[aria-label*="confirm"]');
    await emailInput.fill(email);
    await pwdInput.fill(pwd);
    if (await confirm.isVisible().catch(() => false)) await confirm.fill(pwd);
    const submit = await firstVisible(this.page, ['form button[type="submit"]', 'button[class*="submit"]']);
    await submit.click().catch(() => {});
    await this.page.waitForLoadState('networkidle');
  }
}
