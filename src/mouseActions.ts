import { When } from '@cucumber/cucumber';
import { parseCoords } from './utils/utils';
import { MemoryValue } from '@qavajs/core';

/**
 * Press mouse key
 * @param {string} button - button to press (left, right, middle)
 * @example When I press left mouse button
 */
When('I press {playwrightMouseButton} mouse button', async function (button) {
    await this.playwright.page.mouse.down({ button });
});

/**
 * Release mouse key
 * @param {string} button - button to release (left, right, middle)
 * @example When I release left mouse button
 */
When('I release {playwrightMouseButton} mouse button', async function (button) {
    await this.playwright.page.mouse.up({ button });
});

/**
 * Move mouse to coordinates
 * @param {string} coords - x, y coordinates to move
 * @example When I move mouse to '10, 15'
 */
When('I move mouse to {value}', async function (coords: MemoryValue){
    const [x, y] = parseCoords(await coords.value());
    await this.playwright.page.mouse.move(x, y);
});

/**
 * Scroll mouse wheel by x, y offset
 * @param {string} coords - x, y offset to scroll
 * @example When I scroll mouse wheel by '0, 15'
 */
When('I scroll mouse wheel by {value}', async function (offset: MemoryValue) {
    const [x, y] = parseCoords(await offset.value());
    await this.playwright.page.mouse.wheel(x, y);
});
