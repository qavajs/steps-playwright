import { When } from '@cucumber/cucumber';
import { getValue, getElement, getValueWait, getConditionWait } from './transformers';

/**
 * Wait for element condition
 * @param {string} alias - element to wait condition
 * @param {string} wait - wait condition
 * @param {number|null} [timeout] - custom timeout in ms
 * @example I wait until 'Header' to be visible
 * @example I wait until 'Loading' not to be present
 * @example I wait until 'Search Bar > Submit Button' to be clickable
 * @example I wait until 'Search Bar > Submit Button' to be clickable (timeout: 3000)
 */
When(
    'I wait until {string} {playwrightConditionWait}{playwrightTimeout}',
        async function (alias: string, waitType: string, timeout: number | null) {
        const wait = getConditionWait(waitType);
        const element = await getElement(alias);
        await wait(element, timeout ? timeout : config.browser.timeout.page);
    }
);

/**
 * Wait for element text condition
 * @param {string} alias - element to wait condition
 * @param {string} wait - wait condition
 * @param {string} value - expected value to wait
 * @param {number|null} [timeout] - custom timeout in ms
 * @example I wait until text of 'Header' to be equal 'Javascript'
 * @example I wait until text of 'Header' not to be equal 'Python'
 * @example I wait until text of 'Header' to be equal 'Javascript' (timeout: 3000)
 */
When(
    'I wait until text of {string} {playwrightValueWait} {string}{playwrightTimeout}',
    async function (alias: string, waitType: string, value: string, timeout: number | null) {
        const wait = getValueWait(waitType);
        const element = await getElement(alias);
        const expectedValue = await getValue(value);
        const getValueFn = async () => element.innerText();
        await wait(getValueFn, expectedValue, timeout ? timeout : config.browser.timeout.page);
    }
);

/**
 * Wait for collection length condition
 * @param {string} alias - element to wait condition
 * @param {string} wait - wait condition
 * @param {string} value - expected value to wait
 * @param {number|null} [timeout] - custom timeout in ms
 * @example I wait until number of elements in 'Search Results' collection to be equal '50'
 * @example I wait until number of elements in 'Search Results' collection to be above '49'
 * @example I wait until number of elements in 'Search Results' collection to be below '51'
 * @example I wait until number of elements in 'Search Results' collection to be below '51' (timeout: 3000)
 */
When(
    'I wait until number of elements in {string} collection {playwrightValueWait} {string}{playwrightTimeout}',
    async function (alias: string, waitType: string, value: string, timeout: number | null) {
        const wait = getValueWait(waitType);
        const collection = await getElement(alias);
        const expectedValue = await getValue(value);
        const getValueFn = async () => collection.count();
        await wait(getValueFn, expectedValue, timeout ? timeout : config.browser.timeout.page);
    }
);

/**
 * Wait for element property condition
 * @param {string} property - property
 * @param {string} alias - element to wait condition
 * @param {string} wait - wait condition
 * @param {string} value - expected value to wait
 * @param {number|null} [timeout] - custom timeout in ms
 * @example I wait until 'value' property of 'Search Input' to be equal 'Javascript'
 * @example I wait until 'value' property of 'Search Input' to be equal 'Javascript' (timeout: 3000)
 */
When(
    'I wait until {string} property of {string} {playwrightValueWait} {string}{playwrightTimeout}',
    async function (property: string, alias: string, waitType: string, value: string, timeout: number | null) {
        const propertyName = await getValue(property);
        const wait = getValueWait(waitType);
        const element = await getElement(alias);
        const expectedValue = await getValue(value);
        const getValueFn = async () => element.evaluate(
            (node: any, propertyName: string) => node[propertyName],
            propertyName
        );
        await wait(getValueFn, expectedValue, timeout ? timeout : config.browser.timeout.page);
    }
);

/**
 * Wait for element attribute condition
 * @param {string} attribute - attribute
 * @param {string} alias - element to wait condition
 * @param {string} wait - wait condition
 * @param {string} value - expected value to wait
 * @param {number|null} [timeout] - custom timeout in ms
 * @example I wait until 'href' attribute of 'Home Link' to be equal '/javascript'
 * @example I wait until 'href' attribute of 'Home Link' to be equal '/javascript' (timeout: 3000)
 */
When(
    'I wait until {string} attribute of {string} {playwrightValueWait} {string}{playwrightTimeout}',
    async function (attribute: string, alias: string, waitType: string, value: string, timeout: number | null) {
        const attributeName = await getValue(attribute);
        const wait = getValueWait(waitType);
        const element = await getElement(alias);
        const expectedValue = await getValue(value);
        const getValueFn = async () => element.getAttribute(attributeName);
        await wait(getValueFn, expectedValue, timeout ? timeout : config.browser.timeout.page);
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
 * @param {number|null} [timeout] - custom timeout in ms
 * @example I wait until current url to be equal 'https://qavajs.github.io/'
 * @example I wait until current url not to contain 'java'
 * @example I wait until current url not to contain 'java' (timeout: 3000)
 */
When(
    'I wait until current url {playwrightValueWait} {string}{playwrightTimeout}',
    async function (waitType: string, value: string, timeout: number | null) {
        const wait = getValueWait(waitType);
        const expectedValue = await getValue(value);
        const getValueFn = () => page.url();
        await wait(getValueFn, expectedValue, timeout ? timeout : config.browser.timeout.page);
    }
);

/**
 * Wait for title condition
 * @param {string} wait - wait condition
 * @param {string} value - expected value to wait
 * @param {number|null} [timeout] - custom timeout in ms
 * @example I wait until page title to be equal 'qavajs'
 * @example I wait until page title not to contain 'java'
 * @example I wait until page title to be equal 'qavajs' (timeout: 3000)
 */
When(
    'I wait until page title {playwrightValueWait} {string}{playwrightTimeout}',
    async function (waitType: string, value: string, timeout: number | null) {
        const wait = getValueWait(waitType);
        const expectedValue = await getValue(value);
        const getValueFn = async () => page.title();
        await wait(getValueFn, expectedValue, timeout ? timeout : config.browser.timeout.page);
    }
);
