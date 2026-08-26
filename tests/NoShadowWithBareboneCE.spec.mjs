import { test, expect } from '@playwright/test';
test('NoShadowWithBareboneCE', async ({ page }) => {
    await page.goto('./tests/NoShadowWithBareboneCE.html');
    // wait for 3 seconds
    await page.waitForTimeout(3000);
    const editor = page.locator('#target');
    await expect(editor).toHaveAttribute('mark', 'good');
});
