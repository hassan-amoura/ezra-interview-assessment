export async function firstVisible(page, candidates) {
  for (const c of candidates) {
    const loc = typeof c === 'string' ? page.locator(c) : c;
    if (await loc.first().isVisible().catch(() => false)) return loc.first();
  }
  throw new Error('no candidate locator visible');
}
