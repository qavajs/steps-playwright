import { Then } from '@cucumber/cucumber';
import { getValue, getElement, getConditionWait } from './transformers';
import { getValidation, getPollValidation } from '@qavajs/validation';
import { Locator } from 'playwright';

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
        const timeout = config.browser.timeout.value;
        await element.waitFor({ state: 'attached', timeout });
        const validation = getPollValidation(validationType);
        const elementText = () => element.innerText();
        await validation(elementText, expectedValue, {
            timeout,
            interval: config.browser.timeout.valueInterval
        });
    }
);

/**
 * Verify that property of element satisfies condition
 * @param {string} property - element to verify
 * @param {string} alias - element to verify
 * @param {string} validationType - validation
 * @param {string} value - expected value
 * @example I expect 'value' property of 'Search Input' to be equal 'text'
 * @example I expect 'innerHTML' property of 'Label' to contain '<b>'
 */
Then(
    'I expect {string} property of {string} {playwrightValidation} {string}',
    async function (property: string, alias: string, validationType: string, value: string) {
        const propertyName = await getValue(property);
        const expectedValue = await getValue(value);
        const element = await getElement(alias);
        const timeout = config.browser.timeout.value;
        await element.waitFor({ state: 'attached', timeout });
        const validation = getPollValidation(validationType);
        const actualValue = () => element.evaluate((node: any, propertyName: string) => node[propertyName], propertyName);
        await validation(actualValue, expectedValue, {
            timeout,
            interval: config.browser.timeout.valueInterval
        });
    }
);

/**
 * Verify that attribute of element satisfies condition
 * @param {string} attribute - element to verify
 * @param {string} alias - element to verify
 * @param {string} validationType - validation
 * @param {string} value - expected value
 * @example I expect 'href' attribute of 'Home Link' to contain '/home'
 */
Then(
    'I expect {string} attribute of {string} {playwrightValidation} {string}',
    async function (attribute: string, alias: string, validationType: string, value: string) {
        const attributeName = await getValue(attribute);
        const expectedValue = await getValue(value);
        const element = await getElement(alias);
        const timeout = config.browser.timeout.value;
        await element.waitFor({ state: 'attached', timeout });
        const validation = getPollValidation(validationType);
        const actualValue = () => element.getAttribute(attributeName);
        await validation(actualValue, expectedValue, {
            timeout,
            interval: config.browser.timeout.valueInterval
        });
    }
);

/**
 * Verify that current url satisfies condition
 * @param {string} validationType - validation
 * @param {string} expected - expected value
 * @example I expect current url contains 'wikipedia'
 * @example I expect current url equals 'https://wikipedia.org'
 */
Then(
    'I expect current url {playwrightValidation} {string}',
    async function (validationType: string, expected: string) {
        const validation = getPollValidation(validationType);
        const expectedUrl = await getValue(expected);
        const actualUrl = () => page.url();
        await validation(actualUrl, expectedUrl, {
            timeout: config.browser.timeout.value,
            interval: config.browser.timeout.valueInterval
        });
    }
);

/**
 * Verify that number of element in collection satisfies condition
 * @param {string} alias - collection to verify
 * @param {string} validationType - validation
 * @param {string} value - expected value
 * @example I expect number of elements in 'Search Results' collection to be equal '50'
 * @example I expect number of elements in 'Search Results' collection to be above '49'
 * @example I expect number of elements in 'Search Results' collection to be below '51'
 */
Then(
    'I expect number of elements in {string} collection {playwrightValidation} {string}',
    async function (alias: string, validationType: string, value: string) {
        const expectedValue = await getValue(value);
        const collection = await getElement(alias);
        const validation = getPollValidation(validationType);
        const actualCount = () => collection.count();
        await validation(actualCount, expectedValue, {
            timeout: config.browser.timeout.value,
            interval: config.browser.timeout.valueInterval
        });
    }
);

/**
 * Verify that page title satisfies condition
 * @param {string} validationType - validation
 * @param {string} expected - expected value
 * @example I expect page title equals 'Wikipedia'
 */
Then(
    'I expect page title {playwrightValidation} {string}',
    async function (validationType: string, expected: string) {
        const validation = getPollValidation(validationType);
        const expectedTitle = await getValue(expected);
        const actualTitle = () => page.title();
        await validation(actualTitle, expectedTitle, {
            timeout: config.browser.timeout.value,
            interval: config.browser.timeout.valueInterval
        });
    }
);

/**
 * Verify collection condition
 * @param {string} alias - collection to wait condition
 * @param {string} condition - wait condition
 * @example I expect every element in 'Header > Links' collection to be visible
 * @example I expect every element in 'Loading Bars' collection not to be present
 */
Then('I expect every element in {string} collection {playwrightConditionWait}', async function (alias: string, condition: string) {
    const collection = await getElement(alias);
    const wait = getConditionWait(condition);
    const conditionWait = (element: Locator) => wait(element, config.browser.timeout.page);
    for (let i = 0; i < await collection.count(); i++) {
        const element = collection.nth(i);
        await conditionWait(element);
    }
});

/**
 * Verify that all texts in collection satisfy condition
 * @param {string} alias - collection to get texts
 * @param {string} validationType - validation
 * @param {string} value - expected result
 * @example I expect text of every element in 'Search Results' collection equals to 'google'
 * @example I expect text of every element in 'Search Results' collection does not contain 'google'
 */
Then(
    'I expect text of every element in {string} collection {playwrightValidation} {string}',
    async function (alias: string, validationType: string, value: string) {
        const expectedValue = await getValue(value);
        const collection = await getElement(alias);
        const validation = getValidation(validationType);
        for (let i = 0; i < await collection.count(); i++) {
            const elementText: string = await collection.nth(i).innerText();
            validation(elementText, expectedValue);
        }
    }
);

/**
 * Verify that all particular attributes in collection satisfy condition
 * @param {string} alias - collection to get attrs
 * @param {string} validationType - validation
 * @param {string} value - expected result
 * @example I expect 'href' attribute of every element in 'Search Results' collection to contain 'google'
 */
Then(
    'I expect {string} attribute of every element in {string} collection {playwrightValidation} {string}',
    async function (attribute: string, alias: string, validationType: string, value: string) {
        const expectedValue = await getValue(value);
        const collection = await getElement(alias);
        const validation = getValidation(validationType);
        for (let i = 0; i < await collection.count(); i++) {
            const attributeValue: string | null = await collection.nth(i).getAttribute(attribute);
            validation(attributeValue, expectedValue);
        }
    }
);

/**
 * Verify that all particular properties in collection satisfy condition
 * @param {string} alias - collection to get props
 * @param {string} validationType - validation
 * @param {string} value - expected result
 * @example I expect 'href' property of every element in 'Search Results' collection to contain 'google'
 */
Then(
    'I expect {string} property of every element in {string} collection {playwrightValidation} {string}',
    async function (property: string, alias: string, validationType: string, value: string) {
        const expectedValue = await getValue(value);
        const collection = await getElement(alias);
        const validation = getValidation(validationType);
        for (let i = 0; i < await collection.count(); i++) {
            const propertyValue: string | null = await collection.nth(i).evaluate(
                (node: any, property: string) => node[property], property
            );
            validation(propertyValue, expectedValue);
        }
    }
);

/**
 * Verify that css property of element satisfies condition
 * @param {string} property - element to verify
 * @param {string} alias - element to verify
 * @param {string} validationType - validation
 * @param {string} value - expected value
 * @example I expect 'color' css property of 'Search Input' to be equal 'rgb(42, 42, 42)'
 * @example I expect 'font-family' css property of 'Label' to contain 'Fira'
 */
Then(
    'I expect {string} css property of {string} {playwrightValidation} {string}',
    async function (property: string, alias: string, validationType: string, value: string) {
        const propertyName = await getValue(property);
        const expectedValue = await getValue(value);
        const element = await getElement(alias);
        const timeout = config.browser.timeout.value;
        await element.waitFor({ state: 'attached', timeout });
        const validation = getPollValidation(validationType);
        const actualValue = () => element.evaluate(
            (node: Element, propertyName: string) => getComputedStyle(node).getPropertyValue(propertyName),
            propertyName
        );
        await validation(actualValue, expectedValue, {
            timeout,
            interval: config.browser.timeout.valueInterval
        });
    }
);

/**
 * Verify that text of an alert meets expectation
 * @param {string} validationType - validation
 * @param {string} value - expected text value
 * @example I expect text of alert does not contain 'coffee'
 */
Then(
    'I expect text of alert {playwrightValidation} {string}',
    async function (validationType: string, expectedValue: string) {
        const alertText = await new Promise<string>(resolve => page.once('dialog', async (dialog) => {
            resolve(dialog.message());
        }));
        const expected = await getValue(expectedValue);
        const validation = getValidation(validationType);
        validation(alertText, expected);
    }
);
