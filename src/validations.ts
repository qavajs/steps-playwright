import {Then} from '@cucumber/cucumber';
import {getValue, getElement, getConditionWait} from './transformers';
import {getValidation} from '@qavajs/validation';

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
        this.log(`AR: ${elementText}`);
        this.log(`ER: ${expectedValue}`);
        validation(elementText, expectedValue);
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
        const validation = getValidation(validationType);
        const actualValue = await element.evaluate((node: any, propertyName: string) => node[propertyName], propertyName);
        this.log(`AR: ${actualValue}`);
        this.log(`ER: ${expectedValue}`);
        validation(actualValue, expectedValue);
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
        const validation = getValidation(validationType);
        const actualValue = await element.getAttribute(attributeName);
        this.log(`AR: ${actualValue}`);
        this.log(`ER: ${expectedValue}`);
        validation(actualValue, expectedValue);
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
        const validation = getValidation(validationType);
        const expectedUrl = await getValue(expected);
        const actualUrl = page.url();
        this.log(`AR: ${actualUrl}`);
        this.log(`ER: ${expectedUrl}`);
        validation(actualUrl, expectedUrl);
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
        const validation = getValidation(validationType);
        const actualCount = await collection.count();
        this.log(`AR: ${actualCount}`);
        this.log(`ER: ${expectedValue}`);
        validation(actualCount, expectedValue);
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
        const validation = getValidation(validationType);
        const expectedTitle = await getValue(expected);
        const actualTitle = await page.title();
        this.log(`AR: ${actualTitle}`);
        this.log(`ER: ${expectedTitle}`);
        validation(actualTitle, expectedTitle);
    }
);

/**
 * Verify that all texts in collection satisfy condition
 * @param {string} alias - collection to get texts
 * @param {string} validationType - validation
 * @param {string} value - expected result
 * @example I expect text of every element in 'Search Results' collection equals to 'google'
 * @example I expect text of every element in 'Search Results' collection does not contain 'yandex'
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
        const validation = getValidation(validationType);
        const actualValue = await element.evaluate(
            (node: Element, propertyName: string) => getComputedStyle(node).getPropertyValue(propertyName),
            propertyName
        );
        this.log(`AR: ${actualValue}`);
        this.log(`ER: ${expectedValue}`);
        validation(actualValue, expectedValue);
    }
);

/**
 * Verify that text of an alert meets expectation
 * @param {string} validationType - validation
 * @param {string} value - expected text value
 * @example I expect text of alert does not contain 'coffee'
 */
Then('I expect text of alert {playwrightValidation} {string}', async function (validationType: string, expectedValue: string) {
        const alertText = await new Promise<string>(resolve => page.once('dialog', async (dialog) => {
            resolve(dialog.message());
        }));
        const expected = await getValue(expectedValue);
        const validation = getValidation(validationType);
        this.log(`AR: ${alertText}`);
        this.log(`ER: ${expected}`);
        validation(alertText, expectedValue);
    }
);
