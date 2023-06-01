import { When } from '@cucumber/cucumber';
import { getValue } from './transformers';
import { parseCoords } from './utils/utils';

When('I press {playwrightMouseButton} mouse button', async function (button) {
    await page.mouse.down({ button });
});

When('I release {playwrightMouseButton} mouse button', async function (button) {
    await page.mouse.up({ button });
});

When('I move mouse to {string}', async function (offset){
    const [x, y] = parseCoords(await getValue(offset));
    await page.mouse.move(x, y);
});

When('I scroll mouse wheel by {string}', async function (offset) {
    const [x, y] = parseCoords(await getValue(offset));
    await page.mouse.wheel(x, y);
});
