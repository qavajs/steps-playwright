import memory from '@qavajs/memory';
import { When } from '@cucumber/cucumber';
import { getElement, getValue } from './transformers';

/**
 * Save text of element to memory
 * @param {string} alias - element to get value
 * @param {string} key - key to store value
 * @example I save text of '#1 of Search Results' as 'firstSearchResult'
 */
When('I save text of {string} as {string}', async function (alias, key) {
    const element = await getElement(alias);
    const value = await element.innerText();
    memory.setValue(key, value);
});

/**
 * Save property of element to memory
 * @param {string} property - property to store
 * @param {string} alias - element to get value
 * @param {string} key - key to store value
 * @example I save 'checked' property of 'Checkbox' as 'checked'
 * @example I save '$prop' property of 'Checkbox' as 'checked'
 */
When('I save {string} property of {string} as {string}', async function (property, alias, key) {
    const element = await getElement(alias);
    const propertyName = await getValue(property);
    const value = await element.evaluate((node: any, propertyName: string) => node[propertyName], propertyName);
    memory.setValue(key, value);
});

/**
 * Save attribute of element to memory
 * @param {string} attribute - attribute to store
 * @param {string} alias - element to get value
 * @param {string} key - key to store value
 * @example I save 'href' attribute of 'Link' as 'linkHref'
 * @example I save '$prop' attribute of 'Link' as 'linkHref'
 */
When('I save {string} attribute of {string} as {string}', async function (attribute, alias, key) {
    const element = await getElement(alias);
    const attributeName = await getValue(attribute);
    const value = await element.getAttribute(attributeName);
    memory.setValue(key, value);
});

/**
 * Save number of elements in collection to memory
 * @param {string} alias - collection to get value
 * @param {string} key - key to store value
 * @example I save number of elements in 'Search Results' as 'numberOfSearchResults'
 */
When('I save number of elements in {string} collection as {string}', async function (alias, key) {
    const collection = await getElement(alias);
    const value = await collection.count();
    memory.setValue(key, value);
});

/**
 * Save array of texts of collection to memory
 * @param {string} alias - collection to get values
 * @param {string} key - key to store value
 * @example I save text of every element of 'Search Results' collection as 'searchResults'
 */
When(
    'I save text of every element of {string} collection as {string}',
    async function (alias: string, key: string) {
        const collection = await getElement(alias);
        const values = await collection.evaluateAll(
            (collection: Array<any>) => collection.map(e => e.innerText)
        );
        memory.setValue(key, values);
    }
);

/**
 * Save array of attributes of collection to memory
 * @param {string} alias - collection to get values
 * @param {string} key - key to store value
 * @example I save 'checked' attribute of every element of 'Search > Checkboxes' collection as 'checkboxes'
 */
When(
    'I save {string} attribute of every element of {string} collection as {string}',
    async function (attribute: string, alias: string, key: string) {
        const collection = await getElement(alias);
        const values = await collection.evaluateAll(
            (collection: Array<any>, attr: string) => collection.map(e => e.attributes[attr].value),
            attribute
        );
        memory.setValue(key, values);
    }
);

/**
 * Save array of property of collection to memory
 * @param {string} alias - collection to get values
 * @param {string} key - key to store value
 * @example I save 'href' property of every element of 'Search > Links' collection as 'hrefs'
 */
When(
    'I save {string} property of every element of {string} collection as {string}',
    async function (property: string, alias: string, key: string) {
        const collection = await getElement(alias);
        const values = await collection.evaluateAll(
            (collection: Array<any>, prop: string) => collection.map(e => e[prop]),
            property
        );
        memory.setValue(key, values);
    }
);

/**
 * Save current url to memory
 * @param {string} key - key to store value
 * @example I save current url as 'currentUrl'
 */
When('I save current url as {string}', async function (key: string) {
    memory.setValue(key, page.url());
});

/**
 * Save current page title to memory
 * @param {string} key - key to store value
 * @example I save page title as 'currentTitle'
 */
When('I save page title as {string}', async function (key: string) {
    const title = await page.title();
    memory.setValue(key, title);
});

/**
 * Save page screenshot into memory
 * @param {string} key - key to store value
 * @example I save screenshot as 'screenshot'
 */
When('I save screenshot as {string}', async function(key: string) {
    const screenshot = await page.screenshot();
    memory.setValue(key, screenshot);
});

/**
 * Save full page screenshot into memory
 * @param {string} key - key to store value
 * @example I save full page screenshot as 'screenshot'
 */
When('I save full page screenshot as {string}', async function(key: string) {
    const screenshot = await page.screenshot({ fullPage: true });
    memory.setValue(key, screenshot);
});

/**
 * Save element screenshot into memory
 * @param {string} alias - element to get screenshot
 * @param {string} key - key to store value
 * @example I save screenshot of 'Header > Logo' as 'screenshot'
 */
When('I save screenshot of {string} as {string}', async function(alias: string, key: string) {
    const element = await getElement(alias);
    const screenshot = await element.screenshot();
    memory.setValue(key, screenshot);
});

/**
 * Save css property of element to memory
 * @param {string} property - property to store
 * @param {string} alias - element to get value
 * @param {string} key - key to store value
 * @example I save 'color' css property of 'Checkbox' as 'checkboxColor'
 * @example I save '$propertyName' property of 'Checkbox' as 'checkboxColor'
 */
When('I save {string} css property of {string} as {string}', async function (property, alias, key) {
    const element = await getElement(alias);
    const propertyName = await getValue(property);
    const value = await element.evaluate(
        (node: Element, propertyName: string) => getComputedStyle(node).getPropertyValue(propertyName),
        propertyName
    );
    memory.setValue(key, value);
});

/**
 * Save bounding client rect to memory
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMRect
 * @param {string} alias - element to get value
 * @param {string} key - key to store value
 * @example
 * When I save bounding rect of 'Node' as 'boundingRect'
 * Then I expect '$boundingRect.width' to equal '42'
 */
When('I save bounding rect of {string} as {string}', async function (alias, key) {
    const element = await getElement(alias);
    const value = await element.evaluate((node: Element) => node.getBoundingClientRect());
    memory.setValue(key, value);
});
