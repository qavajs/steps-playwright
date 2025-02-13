import { Then } from '@cucumber/cucumber';
import { type Dialog, type Locator } from '@playwright/test';
import { type MemoryValue, type Validation } from '@qavajs/core';

/**
 * Verify element condition
 * @param {string} alias - element to wait condition
 * @param {string} condition - wait condition
 * @example I expect 'Header' to be visible
 * @example I expect 'Loading' not to be present
 * @example I expect 'Search Bar > Submit Button' to be clickable
 */
Then('I expect {playwrightLocator} {playwrightCondition}', async function (locator: Locator, condition: any) {
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
    async function (locator: Locator, validation: Validation, expected: MemoryValue) {
        const expectedValue = await expected.value();
        const elementText = () => locator.innerText();
        await validation.poll(elementText, expectedValue, {
            timeout: this.config.browser.timeout.value,
            interval: this.config.browser.timeout.valueInterval
        });
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
    async function (locator: Locator, validation: Validation, expected: MemoryValue) {
        const expectedValue = await expected.value();
        const timeout = this.config.browser.timeout.value;
        const actualValue = () => locator.inputValue();
        await validation.poll(actualValue, expectedValue, {
            timeout,
            interval:this.config.browser.timeout.valueInterval
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
    'I expect {value} property of {playwrightLocator} {validation} {value}',
    async function (property: MemoryValue, locator: Locator, validation: Validation, expected: MemoryValue) {
        const propertyName = await property.value();
        const expectedValue = await expected.value();
        const actualValue = () => locator.evaluate((node: any, propertyName: string) => node[propertyName], propertyName);
        await validation.poll(actualValue, expectedValue, {
            timeout: this.config.browser.timeout.value,
            interval: this.config.browser.timeout.valueInterval
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
    'I expect {value} attribute of {playwrightLocator} {validation} {value}',
    async function (attribute: MemoryValue, locator: Locator, validation: Validation, expected: MemoryValue) {
        const attributeName = await attribute.value();
        const expectedValue = await expected.value();
        const actualValue = () => locator.getAttribute(attributeName);
        await validation.poll(actualValue, expectedValue, {
            timeout: this.config.browser.timeout.value,
            interval: this.config.browser.timeout.valueInterval
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
    'I expect current url {validation} {value}',
    async function (validation: Validation, expected: MemoryValue) {
        const expectedUrl = await expected.value();
        const actualUrl = () => this.playwright.page.url();
        await validation.poll(actualUrl, expectedUrl, {
            timeout:this.config.browser.timeout.value,
            interval:this.config.browser.timeout.valueInterval
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
    'I expect number of elements in {playwrightLocator} collection {validation} {value}',
    async function (locator: Locator, validation: Validation, expected: MemoryValue) {
        const expectedValue = await expected.value();
        const actualCount = () => locator.count();
        await validation.poll(actualCount, expectedValue, {
            timeout: this.config.browser.timeout.value,
            interval: this.config.browser.timeout.valueInterval
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
    'I expect page title {validation} {value}',
    async function (validation: Validation, expected: MemoryValue) {
        const expectedTitle = await expected.value();
        const actualTitle = () => this.playwright.page.title();
        await validation.poll(actualTitle, expectedTitle, {
            timeout: this.config.browser.timeout.value,
            interval: this.config.browser.timeout.valueInterval
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
Then('I expect every element in {playwrightLocator} collection {playwrightCondition}', async function (locator: Locator, condition: any) {
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
    async function (locator: Locator, validation: Validation, expected: MemoryValue) {
        const expectedValue = await expected.value();
        for (let i = 0; i < await locator.count(); i++) {
            const elementText = () => locator.nth(i).innerText();
            await validation.poll(elementText, expectedValue);
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
    async function (attribute: MemoryValue, locator: Locator, validation: Validation, expected: MemoryValue) {
        const expectedValue = await expected.value();
        const attributeName = await attribute.value();
        for (let i = 0; i < await locator.count(); i++) {
            const attributeValue = () => locator.nth(i).getAttribute(attributeName);
            await validation.poll(attributeValue, expectedValue);
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
    async function (property: MemoryValue, locator: Locator, validation: Validation, expected: MemoryValue) {
        const expectedValue = await expected.value();
        const propertyName = await property.value()
        for (let i = 0; i < await locator.count(); i++) {
            const propertyValue = () => locator.nth(i).evaluate(
                (node: any, property: string) => node[property], propertyName
            );
            await validation.poll(propertyValue, expectedValue);
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
    async function (property: MemoryValue, locator: Locator, validation: Validation, expected: MemoryValue) {
        const propertyName = await property.value();
        const expectedValue = await expected.value();
        const actualValue = () => locator.evaluate(
            (node: Element, propertyName: string) => getComputedStyle(node).getPropertyValue(propertyName),
            propertyName
        );
        await validation.poll(actualValue, expectedValue, {
            timeout: this.config.browser.timeout.value,
            interval: this.config.browser.timeout.valueInterval
        });
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
    async function (property: MemoryValue, collection: Locator, validation: Validation, expected: MemoryValue) {
        const propertyName = await property.value();
        const expectedValue = await expected.value();
        for (let i = 0; i < await collection.count(); i++) {
            const locator = collection.nth(i);
            const actualValue = () => locator.evaluate(
                (node: Element, propertyName: string) => getComputedStyle(node).getPropertyValue(propertyName),
                propertyName
            );
            await validation.poll(actualValue, expectedValue, {
                timeout: this.config.browser.timeout.value,
                interval: this.config.browser.timeout.valueInterval
            });
        }
    }
);
