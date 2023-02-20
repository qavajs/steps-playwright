import { When } from '@cucumber/cucumber';
import { getValue, getElement, getValueWait, getConditionWait } from './transformers';
import { getValidation } from '@qavajs/validation';

/**
 * Wait for element condition
 * @param {string} alias - element to wait condition
 * @param {string} wait - wait condition
 * @example I wait until 'Header' to be visible
 * @example I wait until 'Loading' not to be present
 * @example I wait until 'Search Bar > Submit Button' to be clickable
 */
When('I wait until {string} {playwrightConditionWait}', async function (alias: string, waitType: string) {
    const wait = getConditionWait(waitType);
    const element = await getElement(alias);
    await wait(element, config.browser.timeout.page);
});

/**
 * Wait for element text condition
 * @param {string} alias - element to wait condition
 * @param {string} wait - wait condition
 * @param {string} value - expected value to wait
 * @example I wait until text of 'Header' to be equal 'Javascript'
 * @example I wait until text of 'Header' not to be equal 'Python'
 */
When(
    'I wait until text of {string} {playwrightValueWait} {string}',
    async function (alias: string, waitType: string, value: string) {
        const wait = getValueWait(waitType);
        const element = await getElement(alias);
        const expectedValue = await getValue(value);
        const getValueFn = async () => element.innerText();
        await wait(getValueFn, expectedValue, config.browser.timeout.page);
    }
);

/**
 * Wait for collection length condition
 * @param {string} alias - element to wait condition
 * @param {string} wait - wait condition
 * @param {string} value - expected value to wait
 * @example I wait until number of elements in 'Search Results' collection to be equal '50'
 * @example I wait until number of elements in 'Search Results' collection to be above '49'
 * @example I wait until number of elements in 'Search Results' collection to be below '51'
 */
When(
    'I wait until number of elements in {string} collection {playwrightValueWait} {string}',
    async function (alias: string, waitType: string, value: string) {
        const wait = getValueWait(waitType);
        const collection = await getElement(alias);
        const expectedValue = await getValue(value);
        const getValueFn = async () => collection.count();
        await wait(getValueFn, expectedValue, config.browser.timeout.page);
    }
);

/**
 * Wait for element property condition
 * @param {string} property - property
 * @param {string} alias - element to wait condition
 * @param {string} wait - wait condition
 * @param {string} value - expected value to wait
 * @example I wait until 'value' property of 'Search Input' to be equal 'Javascript'
 */
When(
    'I wait until {string} property of {string} {playwrightValueWait} {string}',
    async function (property: string, alias: string, waitType: string, value: string) {
        const propertyName = await getValue(property);
        const wait = getValueWait(waitType);
        const element = await getElement(alias);
        const expectedValue = await getValue(value);
        const getValueFn = async () => element.evaluate(
            (node: any, propertyName: string) => node[propertyName],
            propertyName
        );
        await wait(getValueFn, expectedValue, config.browser.timeout.page);
    }
);

/**
 * Wait for element attribute condition
 * @param {string} attribute - attribute
 * @param {string} alias - element to wait condition
 * @param {string} wait - wait condition
 * @param {string} value - expected value to wait
 * @example I wait until 'href' attribute of 'Home Link' to be equal '/javascript'
 */
When(
    'I wait until {string} attribute of {string} {playwrightValueWait} {string}',
    async function (attribute: string, alias: string, waitType: string, value: string) {
        const attributeName = await getValue(attribute);
        const wait = getValueWait(waitType);
        const element = await getElement(alias);
        const expectedValue = await getValue(value);
        const getValueFn = async () => element.getAttribute(attributeName);
        await wait(getValueFn, expectedValue, config.browser.timeout.page);
    }
);

/**
 * Wait
 * @param {number} ms - milliseconds
 * @example I wait 1000 ms
 */
When('I wait {int} ms', async function (ms) {
    await new Promise((resolve: Function): void => {
        setTimeout(() => resolve(), ms)
    });
});

/**
 * Wait for url condition
 * @param {string} wait - wait condition
 * @param {string} value - expected value to wait
 * @example I wait until current url to be equal 'https://qavajs.github.io/'
 * @example I wait until current url not to contain 'java'
 */
When(
    'I wait until current url {playwrightValueWait} {string}',
    async function (waitType: string, value: string) {
        const wait = getValueWait(waitType);
        const expectedValue = await getValue(value);
        const getValueFn = () => page.url();
        await wait(getValueFn, expectedValue, config.browser.timeout.page);
    }
);

/**
 * Wait for title condition
 * @param {string} wait - wait condition
 * @param {string} value - expected value to wait
 * @example I wait until page title to be equal 'qavajs'
 * @example I wait until page title not to contain 'java'
 */
When(
    'I wait until page title {playwrightValueWait} {string}',
    async function (waitType: string, value: string) {
        const wait = getValueWait(waitType);
        const expectedValue = await getValue(value);
        const getValueFn = async () => page.title();
        await wait(getValueFn, expectedValue, config.browser.timeout.page);
    }
);

/**
 * Verify that text of an alert meets expectation
 * @param {string} validationType - validation
 * @param {string} value - expected text value
 * @example I expect text of alert does not contain 'coffee'
 */
When('I wait until text of alert {playwrightValidation} {string}', async function (validationType: string, expectedValue: string) {
      let alertText;
      page.once('dialog', async (dialog) => {
        alertText = dialog.message();
      });
      const validation = getValidation(validationType);
      validation(alertText, expectedValue);
    }
);
