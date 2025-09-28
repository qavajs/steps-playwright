import { type MemoryValue, When } from '@qavajs/core';
import { Locator } from '@playwright/test';
import { QavajsPlaywrightWorld } from './QavajsPlaywrightWorld';

/**
 * Execute client function
 * @param {string} functionKey - memory key of function
 * @example I execute '$fn' function // fn is function reference
 * @example I execute 'window.scrollBy(0, 100)' function
 */
When('I execute {value} function/script', async function (this: QavajsPlaywrightWorld, fn: MemoryValue) {
    await this.playwright.page.evaluate(await fn.value());
});

/**
 * Execute client function and save result into memory
 * @param {string} functionKey - memory key of function
 * @param {string} memoryKey - memory key to store result
 * @example I execute '$fn' function and save result as 'result' // fn is function reference
 * @example I execute 'window.scrollY' function and save result as 'scroll'
 */
When('I execute {value} function/script and save result as {value}', async function (this: QavajsPlaywrightWorld, fn: MemoryValue, memoryKey: MemoryValue) {
    memoryKey.set(await this.playwright.page.evaluate(await fn.value()));
});

/**
 * Execute client function on certain element
 * @param {string} functionKey - memory key of function
 * @param {string} alias - alias of target element
 * @example I execute '$fn' function on 'Component > Element' // fn is function reference
 * @example I execute 'arguments[0].scrollIntoView()' function on 'Component > Element'
 */
When('I execute {value} function/script on {playwrightLocator}', async function (this: QavajsPlaywrightWorld, fnKey: MemoryValue, locator: Locator) {
    let fn = await fnKey.value();
    if (typeof fn === 'string') {
        fn = new Function('return ' + fn)
    }
    await locator.evaluate(fn);
});

/**
 * Execute client function on certain element
 * @param {string} functionKey - memory key of function
 * @param {string} alias - alias of target element
 * @example I execute '$fn' function on 'Component > Element' and save result as 'innerText' // fn is function reference
 * @example I execute 'arguments[0].innerText' function on 'Component > Element' and save result as 'innerText'
 */
When(
    'I execute {value} function/script on {playwrightLocator} and save result as {value}',
    async function (this: QavajsPlaywrightWorld, fnKey: MemoryValue, locator: Locator, memoryKey: MemoryValue) {
        let fn = await fnKey.value();
        if (typeof fn === 'string') {
            fn = new Function('return ' + fn)
        }
        memoryKey.set(await locator.evaluate(fn));
    }
);
