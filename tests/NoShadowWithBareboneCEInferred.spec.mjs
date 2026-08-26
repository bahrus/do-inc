import { test, expect } from '@playwright/test';
test('NoShadowWithBareboneCEInferred', async ({ page }) => {
    await page.goto('./tests/NoShadowWithBareboneCEInferred.html');
    // wait for 3 seconds
    await page.waitForTimeout(3000);
    const editor = page.locator('#target');
    await expect(editor).toHaveAttribute('mark', 'good');
});
