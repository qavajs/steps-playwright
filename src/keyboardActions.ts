import { When } from '@cucumber/cucumber';

/**
 * Press and hold keyboard key
 * @param {string} key - key to press
 * @example When I hold down 'Q' key
 */
When('I hold down {string} key', async function (key) {
    await page.keyboard.down(key);
});

/**
 * Release keyboard key
 * @param {string} key - key to release
 * @example When I release 'A' key
 */
When('I release {string} key', async function (key) {
    await page.keyboard.up(key);
});
