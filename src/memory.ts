import { type Locator } from '@playwright/test';
import { type MemoryValue, When } from '@qavajs/core';

/**
 * Save text of element to memory
 * @param {string} locator - element to get value
 * @param {string} key - key to store value
 * @example I save text of 'Search Results (1)' as 'firstSearchResult'
 */
When('I save text of {playwrightLocator} as {value}', async function (locator: Locator, key: MemoryValue) {
    key.set(await locator.innerText());
});

/**
 * Save property of element to memory
 * @param {string} property - property to store
 * @param {string} locator - element to get value
 * @param {string} key - key to store value
 * @example I save 'checked' property of 'Checkbox' as 'checked'
 * @example I save '$prop' property of 'Checkbox' as 'checked'
 */
When('I save {value} property of {playwrightLocator} as {value}', async function (property: MemoryValue, locator: Locator, key: MemoryValue) {
    const propertyName = await property.value();
    const value = await locator.evaluate((node: any, propertyName: string) => node[propertyName], propertyName);
    key.set(value);
});

/**
 * Save attribute of element to memory
 * @param {string} attribute - attribute to store
 * @param {string} locator - element to get value
 * @param {string} key - key to store value
 * @example I save 'href' attribute of 'Link' as 'linkHref'
 * @example I save '$prop' attribute of 'Link' as 'linkHref'
 */
When('I save {value} attribute of {playwrightLocator} as {value}', async function (attribute: MemoryValue, locator: Locator, key: MemoryValue) {
    const attributeName = await attribute.value();
    const value = await locator.getAttribute(attributeName);
    key.set(value);
});

/**
 * Save number of elements in collection to memory
 * @param {string} locator - collection to get value
 * @param {string} key - key to store value
 * @example I save number of elements in 'Search Results' as 'numberOfSearchResults'
 */
When('I save number of elements in {playwrightLocator} collection as {value}', async function (locator: Locator, key: MemoryValue) {
    const value = await locator.count();
    key.set(value);
});

/**
 * Save array of texts of collection to memory
 * @param {string} locator - collection to get values
 * @param {string} key - key to store value
 * @example I save text of every element of 'Search Results' collection as 'searchResults'
 */
When(
    'I save text of every element of {playwrightLocator} collection as {value}',
    async function (locator: Locator, key: MemoryValue) {
        const values = await locator.evaluateAll(
            (collection: Array<any>) => collection.map(e => e.innerText)
        );
        key.set(values);
    }
);

/**
 * Save array of attributes of collection to memory
 * @param {string} locator - collection to get values
 * @param {string} key - key to store value
 * @example I save 'checked' attribute of every element of 'Search > Checkboxes' collection as 'checkboxes'
 */
When(
    'I save {value} attribute of every element of {playwrightLocator} collection as {value}',
    async function (attribute: MemoryValue, locator: Locator, key: MemoryValue) {
        const values = await locator.evaluateAll(
            (collection: Array<any>, attr: string) => collection.map(e => e.attributes[attr].value),
            await attribute.value()
        );
        key.set(values);
    }
);

/**
 * Save array of property of collection to memory
 * @param {string} locator - collection to get values
 * @param {string} key - key to store value
 * @example I save 'href' property of every element of 'Search > Links' collection as 'hrefs'
 */
When(
    'I save {value} property of every element of {playwrightLocator} collection as {value}',
    async function (property: MemoryValue, locator: Locator, key: MemoryValue) {
        const values = await locator.evaluateAll(
            (collection: Array<any>, prop: string) => collection.map(e => e[prop]),
            await property.value()
        );
        key.set(values);
    }
);

/**
 * Save current url to memory
 * @param {string} key - key to store value
 * @example I save current url as 'currentUrl'
 */
When('I save current url as {value}', async function (key: MemoryValue) {
    key.set(this.playwright.page.url());
});

/**
 * Save current page title to memory
 * @param {string} key - key to store value
 * @example I save page title as 'currentTitle'
 */
When('I save page title as {value}', async function (key: MemoryValue) {
    key.set(await this.playwright.page.title());
});

/**
 * Save page screenshot into memory
 * @param {string} key - key to store value
 * @example I save screenshot as 'screenshot'
 */
When('I save screenshot as {value}', async function(key: MemoryValue) {
    const screenshot = await this.playwright.page.screenshot();
    key.set(screenshot);
});

/**
 * Save full page screenshot into memory
 * @param {string} key - key to store value
 * @example I save full page screenshot as 'screenshot'
 */
When('I save full page screenshot as {value}', async function(key: MemoryValue) {
    const screenshot = await this.playwright.page.screenshot({ fullPage: true });
    key.set(screenshot);
});

/**
 * Save element screenshot into memory
 * @param {string} locator - element to get screenshot
 * @param {string} key - key to store value
 * @example I save screenshot of 'Header > Logo' as 'screenshot'
 */
When('I save screenshot of {playwrightLocator} as {value}', async function(locator: Locator, key: MemoryValue) {
    const screenshot = await locator.screenshot();
    key.set(screenshot);
});

/**
 * Save css property of element to memory
 * @param {string} property - property to store
 * @param {string} locator - element to get value
 * @param {string} key - key to store value
 * @example I save 'color' css property of 'Checkbox' as 'checkboxColor'
 * @example I save '$propertyName' property of 'Checkbox' as 'checkboxColor'
 */
When('I save {value} css property of {playwrightLocator} as {value}', async function (property: MemoryValue, locator: Locator, key: MemoryValue) {
    const propertyName = await property.value();
    const value = await locator.evaluate(
        (node: Element, propertyName: string) => getComputedStyle(node).getPropertyValue(propertyName),
        propertyName
    );
    key.set(value);
});

/**
 * Save bounding client rect to memory
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMRect
 * @param {string} locator - element to get value
 * @param {string} key - key to store value
 * @example
 * When I save bounding rect of 'Node' as 'boundingRect'
 * Then I expect '$boundingRect.width' to equal '42'
 */
When('I save bounding rect of {playwrightLocator} as {value}', async function (locator: Locator, key: MemoryValue) {
    const value = await locator.evaluate((node: Element) => node.getBoundingClientRect());
    key.set(value);
});
