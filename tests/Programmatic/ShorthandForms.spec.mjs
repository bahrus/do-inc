import { test, expect } from '@playwright/test';
test('Programmatic>ShorthandForms', async ({ page }) => {
    await page.goto('./tests/Programmatic/ShorthandForms.html');
    await page.waitForTimeout(2500);
    const target = page.locator('#target');
    await expect(target).toHaveAttribute('mark', 'good');
});
