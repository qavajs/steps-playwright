import { When } from '@cucumber/cucumber';
import { getValue, getElement, getConditionWait } from './transformers';
import { getPollValidation, getValidation } from '@qavajs/validation';
import { expect } from "@playwright/test";

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
    'I wait until {string} {playwrightConditionWait}( ){playwrightTimeout}',
        async function (alias: string, waitType: string, timeoutValue: number | null) {
        const wait = getConditionWait(waitType);
        const element = await getElement(alias);
        await wait(element, timeoutValue ?? config.browser.timeout.page);
    }
);

/**
 * Refresh page unless element matches condition
 * @param {string} alias - element to wait condition
 * @param {string} wait - wait condition
 * @param {number|null} [timeout] - custom timeout in ms
 * @example I refresh page until 'Internal Server Error Box' to be visible
 * @example I refresh page until 'Submit Button' to be enabled
 * @example I refresh page until 'Place Order Button' to be clickable (timeout: 3000)
 */
When(
  'I refresh page until {string} {playwrightConditionWait}( ){playwrightTimeout}',
  async function (alias: string, waitType: string, timeoutValue: number | null) {
    const timeout = timeoutValue ?? config.browser.timeout.value;
    const wait = getConditionWait(waitType);
    const element = await getElement(alias);
    await expect(async () => {
      await page.reload()
      await wait(element, config.browser.timeout.pageRefreshInterval);
    }).toPass({timeout});
  });

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
    'I wait until text of {string} {playwrightValidation} {string}( ){playwrightTimeout}',
    async function (alias: string, waitType: string, value: string, timeoutValue: number | null) {
        const wait = getPollValidation(waitType);
        const element = await getElement(alias);
        const timeout = timeoutValue ?? config.browser.timeout.value;
        await element.waitFor({ state: 'attached', timeout });
        const expectedValue = await getValue(value);
        const getValueFn = () => element.innerText();
        await wait(getValueFn, expectedValue, {
            timeout,
            interval: config.browser.timeout.valueInterval
        });
    }
);

/**
 * Refresh page unless element text matches condition
 * @param {string} alias - element to wait condition
 * @param {string} wait - wait condition
 * @param {string} value - expected value to wait
 * @param {number|null} [timeout] - custom timeout in ms
 * @example I refresh page until text of 'Order Status' to be equal 'Processing'
 * @example I refresh page until text of 'Currency' not contain '$'
 * @example I refresh page until text of 'My Salary' to match '/5\d{3,}/' (timeout: 3000)
 */
When(
  'I refresh page until text of {string} {playwrightValidation} {string}( ){playwrightTimeout}',
  async function (alias: string, validationType: string, value: string, timeoutValue: number | null) {
      const validation = getValidation(validationType);
      const element = await getElement(alias);
      const timeout = timeoutValue ?? config.browser.timeout.value;
      await element.waitFor({state: 'attached', timeout});
      const expectedValue = await getValue(value);
      await expect(async () => {
          await page.reload();
          const actualValue = await element.innerText();
          await validation(actualValue, expectedValue);
          }
        ).toPass({timeout, intervals: [2_000, 5_000]});
    }
);

/**
 * Repeatedly click an element unless element text matches condition
 * @param {string} aliasToClick - element to wait condition
 * @param {string} aliasToCheck - element to wait condition
 * @param {string} wait - wait condition
 * @param {string} text - expected value to wait
 * @param {number|null} [timeout] - custom timeout in ms
 * @example I click 'Send Message Button' until text of 'Information Alert' to be equal 'Your account has been banned'
 * @example I click 'Add To Cart Button' until text of 'Shopping Cart Total' to match '/\$5\d{3,}/' (timeout: 3000)
 */
When(
  'I click {string} until text of {string} {playwrightValidation} {string}( ){playwrightTimeout}',
  async function (
      aliasToClick: string,
      aliasToCheck: string,
      validationType: string,
      value: string,
      timeoutValue: number | null,
      ) {
      const elementToClick = await getElement(aliasToClick);
      const elementToCheck = await getElement(aliasToCheck);
      const timeout = timeoutValue ?? config.browser.timeout.value;
      await elementToClick.waitFor({state: 'attached', timeout});
      const expectedText = await getValue(value);
      const poll = getPollValidation(validationType);
      await poll(
        async () => {
          await elementToClick.click();
          return elementToCheck.innerText();
        },
        expectedText,
        {timeout, interval: config.browser.timeout.actionInterval},
        );
    },
);

/**
 * Repeatedly click an element unless element value attribute matches condition
 * @param {string} aliasToClick - element to wait condition
 * @param {string} aliasToCheck - element to wait condition
 * @param {string} wait - wait condition
 * @param {string} value - expected value to wait
 * @param {number|null} [timeout] - custom timeout in ms
 * @example I click 'Plus Button' until value of 'Quantity Input' to be equal '9'
 * @example I click 'Suggest Button' until value of 'Repository Name Input' to match '/\w{5,}/' (timeout: 30000)
 */
When(
  'I click {string} until value of {string} {playwrightValidation} {string}( ){playwrightTimeout}',
  async function (
      aliasToClick: string,
      aliasToCheck: string,
      validationType: string,
      value: string,
      timeoutValue: number | null,
      ) {
      const elementToClick = await getElement(aliasToClick);
      const elementToCheck = await getElement(aliasToCheck);
      const timeout = timeoutValue ?? config.browser.timeout.value;
      await elementToClick.waitFor({state: 'attached', timeout});
      const expectedValue = await getValue(value);
      const poll = getPollValidation(validationType);
      await poll(
        async () => {
            await elementToClick.click();
            return elementToCheck.inputValue();
            },
            expectedValue,
            {timeout, interval: config.browser.timeout.actionInterval},
        );
    },
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
    'I wait until number of elements in {string} collection {playwrightValidation} {string}( ){playwrightTimeout}',
    async function (alias: string, waitType: string, value: string, timeoutValue: number | null) {
        const wait = getPollValidation(waitType);
        const collection = await getElement(alias);
        const expectedValue = await getValue(value);
        const getValueFn = () => collection.count();
        await wait(getValueFn, expectedValue, {
            timeout: timeoutValue ?? config.browser.timeout.value,
            interval: config.browser.timeout.valueInterval
        });
    }
);

/**
 * Wait for element value condition
 * @param {string} alias - element to wait condition
 * @param {string} wait - wait condition
 * @param {string} value - expected value to wait
 * @param {number|null} [timeout] - custom timeout in ms
 * @example I wait until value of 'Search Input' to be equal 'Javascript'
 * @example I wait until value of 'Search Input' to be equal 'Javascript' (timeout: 3000)
 */
When(
    'I wait until value of {string} {playwrightValidation} {string}( ){playwrightTimeout}',
    async function (alias: string, waitType: string, value: string, timeoutValue: number | null) {
        const wait = getPollValidation(waitType);
        const element = await getElement(alias);
        const timeout = timeoutValue ?? config.browser.timeout.value;
        await element.waitFor({ state: 'attached', timeout });
        const expectedValue = await getValue(value);
        const getValueFn = () => element.evaluate(
            (node: any) => node.value
        );
        await wait(getValueFn, expectedValue, {
            timeout,
            interval: config.browser.timeout.valueInterval
        });
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
    'I wait until {string} property of {string} {playwrightValidation} {string}( ){playwrightTimeout}',
    async function (property: string, alias: string, waitType: string, value: string, timeoutValue: number | null) {
        const propertyName = await getValue(property);
        const wait = getPollValidation(waitType);
        const element = await getElement(alias);
        const timeout = timeoutValue ?? config.browser.timeout.value;
        await element.waitFor({ state: 'attached', timeout });
        const expectedValue = await getValue(value);
        const getValueFn = () => element.evaluate(
            (node: any, propertyName: string) => node[propertyName],
            propertyName
        );
        await wait(getValueFn, expectedValue, {
            timeout,
            interval: config.browser.timeout.valueInterval
        });
    }
);

/**
 * Wait for element css property condition
 * @param {string} property - css property
 * @param {string} alias - element to wait condition
 * @param {string} wait - wait condition
 * @param {string} value - expected value to wait
 * @param {number|null} [timeout] - custom timeout in ms
 * @example I wait until 'color' css property of 'Search Input' to be equal 'rgb(42, 42, 42)'
 * @example I wait until 'font-family' css property of 'Search Input' to be equal 'Fira' (timeout: 3000)
 */
When(
    'I wait until {string} css property of {string} {playwrightValidation} {string}( ){playwrightTimeout}',
    async function (property: string, alias: string, waitType: string, value: string, timeoutValue: number | null) {
        const propertyName = await getValue(property);
        const wait = getPollValidation(waitType);
        const element = await getElement(alias);
        const timeout = timeoutValue ?? config.browser.timeout.value;
        await element.waitFor({ state: 'attached', timeout });
        const expectedValue = await getValue(value);
        const getValueFn = () => element.evaluate(
            (node: Element, propertyName: string) => getComputedStyle(node).getPropertyValue(propertyName),
            propertyName
        );
        await wait(getValueFn, expectedValue, {
            timeout,
            interval: config.browser.timeout.valueInterval
        });
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
    'I wait until {string} attribute of {string} {playwrightValidation} {string}( ){playwrightTimeout}',
    async function (attribute: string, alias: string, waitType: string, value: string, timeoutValue: number | null) {
        const attributeName = await getValue(attribute);
        const wait = getPollValidation(waitType);
        const element = await getElement(alias);
        const timeout = timeoutValue ?? config.browser.timeout.value;
        await element.waitFor({ state: 'attached', timeout });
        const expectedValue = await getValue(value);
        const getValueFn = () => element.getAttribute(attributeName);
        await wait(getValueFn, expectedValue, {
            timeout,
            interval: config.browser.timeout.valueInterval
        });
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
    'I wait until current url {playwrightValidation} {string}( ){playwrightTimeout}',
    async function (waitType: string, value: string, timeoutValue: number | null) {
        const wait = getPollValidation(waitType);
        const expectedValue = await getValue(value);
        const getValueFn = () => page.url();
        await wait(getValueFn, expectedValue, {
            timeout: timeoutValue ?? config.browser.timeout.value,
            interval: config.browser.timeout.valueInterval
        });
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
    'I wait until page title {playwrightValidation} {string}( ){playwrightTimeout}',
    async function (waitType: string, value: string, timeoutValue: number | null) {
        const wait = getPollValidation(waitType);
        const expectedValue = await getValue(value);
        const getValueFn = () => page.title();
        await wait(getValueFn, expectedValue, {
            timeout: timeoutValue ?? config.browser.timeout.value,
            interval: config.browser.timeout.valueInterval
        });
    }
);
