import { type MemoryValue, When } from '@qavajs/core';

/**
 * Execute client function on electron process and save result into memory
 * @param {string} functionKey - memory key of function
 * @param {string} memoryKey - memory key to store result
 * @example I execute '$fn' function and save result as 'result' // fn is function reference
 * @example I execute '$js(async ({ app }) => app.getAppPath())' function and save result as 'scroll'
 */
When('I execute {value} function/script on electron app', async function (fn: MemoryValue) {
    await this.playwright.driver.evaluate(await fn.value());
});

/**
 * Execute client function on electron process and save result into memory
 * @param {string} functionKey - memory key of function
 * @param {string} memoryKey - memory key to store result
 * @example I execute '$fn' function and save result as 'result' // fn is function reference
 * @example I execute '$js(async ({ app }) => app.getAppPath())' function on electron app and save result as 'result'
 */
When('I execute {value} function/script on electron app and save result as {value}', async function (fn: MemoryValue, memoryKey: MemoryValue) {
    memoryKey.set(await this.playwright.driver.evaluate(await fn.value()));
});