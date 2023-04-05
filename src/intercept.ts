import { When } from '@cucumber/cucumber';
import { getValue } from './transformers';
import memory from '@qavajs/memory';

/**
 * Create interception for url or predicate function
 * @param {string | function} url - url or predicate function to listen
 * @param {string} key - memory key to save
 * @example I create interception for '**\/api/qavajs' as 'intercept'
 * @example I create interception for '$interceptHandler' as 'intercept' // if you need to pass function as interception handler
 */
When('I create interception for {string} as {string}', async function (predicate: string, key: string) {
    const predicateValue = await getValue(predicate);
    memory.setValue(key, page.waitForResponse(predicateValue));
});

/**
 * Wait for interception response
 * @param {string} interception - key of saved interception promise
 * @example I wait for '$interception' response
 */
When('I wait for {string} response', async function (interception: string) {
    const interceptionPromise = await getValue(interception);
    await interceptionPromise;
});

/**
 * Save interception response
 * @param {string} interception - key of saved interception promise
 * @example I save '$interception' response as 'response'
 */
When('I save {string} response as {string}', async function (interception: string, key: string) {
    const interceptionPromise = await getValue(interception);
    memory.setValue(key, await interceptionPromise);
});
