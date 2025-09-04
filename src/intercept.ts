import { type MemoryValue, When } from '@qavajs/core';

/**
 * Create interception for url or predicate function
 * @param {string | function} url - url or predicate function to listen
 * @param {string} key - memory key to save
 * @example I create interception for '**\/api/qavajs' as 'intercept'
 * @example I create interception for '$interceptHandler' as 'intercept' // if you need to pass function as interception handler
 */
When('I create interception for {value} as {value}', async function (predicate: MemoryValue, key: MemoryValue) {
    key.set(this.playwright.page.waitForResponse(await predicate.value()))
});

/**
 * Wait for interception response
 * @param {string} interception - key of saved interception promise
 * @example I wait for '$interception' response
 */
When('I wait for {value} response', async function (interception: MemoryValue) {
    const interceptionPromise = await interception.value();
    await interceptionPromise;
});

/**
 * Save interception response
 * @param {string} interception - key of saved interception promise
 * @example I save '$interception' response as 'response'
 */
When('I save {value} response as {value}', async function (interception: MemoryValue, key: MemoryValue) {
    const interceptionPromise = await interception.value();
    key.set(await interceptionPromise);
});
