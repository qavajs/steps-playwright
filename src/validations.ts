import { Then } from '@cucumber/cucumber';
import { getValue, getElement, getConditionWait } from './transformers';
import { getValidation } from '@qavajs/validation';

/**
 * Verify element condition
 * @param {string} alias - element to wait condition
 * @param {string} condition - wait condition
 * @example I expect 'Header' to be visible
 * @example I expect 'Loading' not to be present
 * @example I expect 'Search Bar > Submit Button' to be clickable
 */
Then('I expect {string} {playwrightConditionWait}', async function (alias: string, condition: string) {
    const element = await getElement(alias);
    const wait = getConditionWait(condition);
    await wait(element, config.browser.timeout.page);
});

/**
 * Verify that text of element satisfies condition
 * @param {string} alias - element to get text
 * @param {string} validationType - validation
 * @param {string} value - expected result
 * @example I expect text of '#1 of Search Results' equals to 'google'
 * @example I expect text of '#2 of Search Results' does not contain 'yandex'
 */
Then(
    'I expect text of {string} {playwrightValidation} {string}',
    async function (alias: string, validationType: string, value: any) {
        const expectedValue = await getValue(value);
        const element = await getElement(alias);
        const validation = getValidation(validationType);
        const elementText: string = await element.innerText();
        validation(elementText, expectedValue);
    }
);
