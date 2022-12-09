import { When } from '@cucumber/cucumber';
import { getValue, getElement } from './transformers';
import memory from '@qavajs/memory';

/**
 * Execute client function
 * @param {string} functionKey - memory key of function
 * @example I execute '$fn' function // fn is function reference
 * @example I execute 'window.scrollBy(0, 100)' function
 */
When('I execute {string} function', async function (functionKey) {
    const fn = await getValue(functionKey);
    await page.evaluate(fn);
});

/**
 * Execute client function and save result into memory
 * @param {string} functionKey - memory key of function
 * @param {string} memoryKey - memory key to store result
 * @example I execute '$fn' function and save result as 'result' // fn is function reference
 * @example I execute 'window.scrollY' function and save result as 'scroll'
 */
When('I execute {string} function and save result as {string}', async function (functionKey, memoryKey) {
    const fn = await getValue(functionKey);
    memory.setValue(memoryKey, await page.evaluate(fn));
});

/**
 * Execute client function on certain element
 * @param {string} functionKey - memory key of function
 * @param {string} alias - alias of target element
 * @example I execute '$fn' function on 'Component > Element' // fn is function reference
 * @example I execute 'arguments[0].scrollIntoView()' function on 'Component > Element'
 */
When('I execute {string} function on {string}', async function (functionKey, alias) {
    let fn = await getValue(functionKey);
    const element = await getElement(alias);
    if (typeof fn === 'string') {
        fn = new Function('return ' + fn)
    }
    await element.evaluate(fn);
});

/**
 * Execute client function on certain element
 * @param {string} functionKey - memory key of function
 * @param {string} alias - alias of target element
 * @example I execute '$fn' function on 'Component > Element' and save result as 'innerText' // fn is function reference
 * @example I execute 'arguments[0].innerText' function on 'Component > Element' and save result as 'innerText'
 */
When(
    'I execute {string} function on {string} and save result as {string}',
    async function (functionKey, alias, memoryKey) {
        let fn = await getValue(functionKey);
        if (typeof fn === 'string') {
            fn = new Function('return ' + fn)
        }
        const element = await getElement(alias);
        memory.setValue(memoryKey, await element.evaluate(fn));
    }
);
