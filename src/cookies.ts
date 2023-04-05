import { When } from '@cucumber/cucumber';
import { getValue } from './transformers';
import memory from '@qavajs/memory';

/**
 * Set cookie
 * @param {string} cookie - cookie name
 * @param {string} value - value to set
 * @example I set 'userID' cookie 'user1'
 * @example I set 'userID' cookie '$userIdCookie'
 */
When('I set {string} cookie as {string}', async function (cookie, value) {
    const cookieValue = await getValue(value);
    const cookieObject = typeof cookieValue === 'object' ? cookieValue : { value: cookieValue };
    if (!cookieObject.url && !cookieObject.domain && !cookieObject.path) {
        cookieObject.url = page.url();
    }
    await context.addCookies([{ name: await getValue(cookie), ...cookieObject }]);
});

/**
 * Save cookie value to memory
 * @param {string} cookie - cookie name
 * @param {string} key - memory key
 * @example I save value of 'auth' cookie as 'authCookie'
 */
When('I save value of {string} cookie as {string}', async function (cookie, key) {
    const cookieName = await getValue(cookie);
    const cookies = await context.cookies();
    const cookieValue = cookies.find(c => c.name === cookieName);
    memory.setValue(key, cookieValue);
});
