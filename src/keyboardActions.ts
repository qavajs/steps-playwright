import { When } from '@cucumber/cucumber';
import { getValue } from './transformers';
import { parseCoords } from './utils/utils';

When('I hold down {string} key', async function (key) {
    await page.keyboard.down(key);
});

When('I release {string} key', async function (key) {
    await page.keyboard.up(key);
});
