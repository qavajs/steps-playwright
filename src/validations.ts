import { type Locator } from '@playwright/test';
import { type MemoryValue, type Validation, Then } from '@qavajs/core';
import { QavajsPlaywrightWorld } from './QavajsPlaywrightWorld';

/**
 * Verify element condition
 * @param {string} alias - element to wait condition
 * @param {string} condition - wait condition
 * @example I expect 'Header' to be visible
 * @example I expect 'Loading' not to be present
 * @example I expect 'Search Bar > Submit Button' to be clickable
 */
Then('I expect {playwrightLocator} {playwrightCondition}', async function (this: QavajsPlaywrightWorld, locator: Locator, condition: any) {
    await condition(locator, this.config.browser.timeout.page);
});

/**
 * Verify that text of element satisfies condition
 * @param {string} alias - element to get text
 * @param {string} validationType - validation
 * @param {string} value - expected result
 * @example I expect text of 'Search Results (1)' equals to 'google'
 */
Then(
    'I expect text of {playwrightLocator} {validation} {value}',
    async function (this: QavajsPlaywrightWorld, locator: Locator, validation: Validation, expected: MemoryValue) {
        const expectedValue = await expected.value();
        const timeout = this.config.browser.timeout.value;
        const interval = this.config.browser.timeout.valueInterval;
        const elementText = () => locator.innerText({ timeout: interval });
        await validation.poll(elementText, expectedValue, { timeout, interval });
    }
);

/**
 * Verify value of element
 * @param {string} alias - element to verify
 * @param {string} validationType - validation
 * @param {string} value - expected value
 * @example I expect value of 'Search Input' to be equal 'text'
 */
Then(
    'I expect value of {playwrightLocator} {validation} {value}',
    async function (this: QavajsPlaywrightWorld, locator: Locator, validation: Validation, expected: MemoryValue) {
        const expectedValue = await expected.value();
        const timeout = this.config.browser.timeout.value;
        const interval = this.config.browser.timeout.valueInterval;
        const actualValue = () => locator.inputValue({ timeout: interval });
        await validation.poll(actualValue, expectedValue, { timeout, interval });
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
    'I expect {value} property of {playwrightLocator} {validation} {value}',
    async function (this: QavajsPlaywrightWorld, property: MemoryValue, locator: Locator, validation: Validation, expected: MemoryValue) {
        const propertyName = await property.value();
        const expectedValue = await expected.value();
        const timeout = this.config.browser.timeout.value;
        const interval = this.config.browser.timeout.valueInterval;
        const actualValue =
            () => locator.evaluate((node: any, propertyName: string) => node[propertyName], propertyName, { timeout: interval });
        await validation.poll(actualValue, expectedValue, { timeout, interval });
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
    'I expect {value} attribute of {playwrightLocator} {validation} {value}',
    async function (this: QavajsPlaywrightWorld, attribute: MemoryValue, locator: Locator, validation: Validation, expected: MemoryValue) {
        const attributeName = await attribute.value();
        const expectedValue = await expected.value();
        const timeout = this.config.browser.timeout.value;
        const interval = this.config.browser.timeout.valueInterval;
        const actualValue = () => locator.getAttribute(attributeName, { timeout: interval });
        await validation.poll(actualValue, expectedValue, { timeout, interval });
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
    'I expect current url {validation} {value}',
    async function (this: QavajsPlaywrightWorld, validation: Validation, expected: MemoryValue) {
        const expectedUrl = await expected.value();
        const timeout = this.config.browser.timeout.value;
        const interval = this.config.browser.timeout.valueInterval;
        const actualUrl = () => this.playwright.page.url();
        await validation.poll(actualUrl, expectedUrl, { timeout, interval });
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
    'I expect number of elements in {playwrightLocator} collection {validation} {value}',
    async function (this: QavajsPlaywrightWorld, locator: Locator, validation: Validation, expected: MemoryValue) {
        const expectedValue = await expected.value();
        const timeout = this.config.browser.timeout.value;
        const interval = this.config.browser.timeout.valueInterval;
        const actualCount = () => locator.count();
        await validation.poll(actualCount, expectedValue, { timeout, interval });
    }
);

/**
 * Verify that page title satisfies condition
 * @param {string} validationType - validation
 * @param {string} expected - expected value
 * @example I expect page title equals 'Wikipedia'
 */
Then(
    'I expect page title {validation} {value}',
    async function (this: QavajsPlaywrightWorld, validation: Validation, expected: MemoryValue) {
        const expectedTitle = await expected.value();
        const timeout = this.config.browser.timeout.value;
        const interval = this.config.browser.timeout.valueInterval;
        const actualTitle = () => this.playwright.page.title();
        await validation.poll(actualTitle, expectedTitle, { timeout, interval });
    }
);

/**
 * Verify collection condition
 * @param {string} alias - collection to wait condition
 * @param {string} condition - wait condition
 * @example I expect every element in 'Header > Links' collection to be visible
 * @example I expect every element in 'Loading Bars' collection not to be present
 */
Then('I expect every element in {playwrightLocator} collection {playwrightCondition}', async function (this: QavajsPlaywrightWorld, locator: Locator, condition: any) {
    const conditionWait = (element: Locator) => condition(element, this.config.browser.timeout.page);
    for (let i = 0; i < await locator.count(); i++) {
        await conditionWait(locator.nth(i));
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
    'I expect text of every element in {playwrightLocator} collection {validation} {value}',
    async function (this: QavajsPlaywrightWorld, locator: Locator, validation: Validation, expected: MemoryValue) {
        const expectedValue = await expected.value();
        const interval = this.config.browser.timeout.valueInterval;
        for (let i = 0; i < await locator.count(); i++) {
            const elementText = () => locator.nth(i).innerText({ timeout: interval });
            await validation.poll(elementText, expectedValue, { interval });
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
    'I expect {value} attribute of every element in {playwrightLocator} collection {validation} {value}',
    async function (this: QavajsPlaywrightWorld, attribute: MemoryValue, locator: Locator, validation: Validation, expected: MemoryValue) {
        const expectedValue = await expected.value();
        const attributeName = await attribute.value();
        const interval = this.config.browser.timeout.valueInterval;
        for (let i = 0; i < await locator.count(); i++) {
            const attributeValue = () => locator.nth(i).getAttribute(attributeName, { timeout: interval });
            await validation.poll(attributeValue, expectedValue, { interval });
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
    'I expect {value} property of every element in {playwrightLocator} collection {validation} {value}',
    async function (this: QavajsPlaywrightWorld, property: MemoryValue, locator: Locator, validation: Validation, expected: MemoryValue) {
        const expectedValue = await expected.value();
        const propertyName = await property.value();
        const interval = this.config.browser.timeout.valueInterval;
        for (let i = 0; i < await locator.count(); i++) {
            const propertyValue = () => locator.nth(i).evaluate(
                (node: any, property: string) => node[property],
                propertyName,
                { timeout: interval },
            );
            await validation.poll(propertyValue, expectedValue, { interval });
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
    'I expect {value} css property of {playwrightLocator} {validation} {value}',
    async function (this: QavajsPlaywrightWorld, property: MemoryValue, locator: Locator, validation: Validation, expected: MemoryValue) {
        const propertyName = await property.value();
        const expectedValue = await expected.value();
        const timeout = this.config.browser.timeout.value;
        const interval = this.config.browser.timeout.valueInterval;
        const actualValue = () => locator.evaluate(
            (node: Element, propertyName: string) => getComputedStyle(node).getPropertyValue(propertyName),
            propertyName,
            { timeout: interval }
        );
        await validation.poll(actualValue, expectedValue, { timeout, interval });
    }
);

/**
 * Verify that css property of every element in collection satisfies condition
 * @param {string} property - property to verify
 * @param {string} alias - collection to verify
 * @param {string} validationType - validation
 * @param {string} value - expected value
 * @example I expect 'color' css property of every element in 'Table > Rows' collection to be equal 'rgb(42, 42, 42)'
 * @example I expect 'font-family' css property of every element in 'Labels' to contain 'Fira'
 */
Then(
    'I expect {value} css property of every element in {playwrightLocator} collection {validation} {value}',
    async function (this: QavajsPlaywrightWorld, property: MemoryValue, collection: Locator, validation: Validation, expected: MemoryValue) {
        const propertyName = await property.value();
        const expectedValue = await expected.value();
        const timeout = this.config.browser.timeout.value;
        const interval = this.config.browser.timeout.valueInterval;
        for (let i = 0; i < await collection.count(); i++) {
            const locator = collection.nth(i);
            const actualValue = () => locator.evaluate(
                (node: Element, propertyName: string) => getComputedStyle(node).getPropertyValue(propertyName),
                propertyName,
                { timeout: interval }
            );
            await validation.poll(actualValue, expectedValue, { timeout, interval });
        }
    }
);
