import { When } from '@cucumber/cucumber';
import { getValue, getElement } from './transformers';
import { po } from '@qavajs/po-playwright';

/**
 * Opens provided url
 * @param {string} url - url to navigate
 * @example I open 'https://google.com'
 */
When('I open {string} url', async function (url: string) {
    const urlValue = await getValue(url);
    await page.goto(urlValue);
});

/**
 * Type text to element
 * @param {string} alias - element to type
 * @param {string} value - value to type
 * @example I type 'wikipedia' to 'Google Input'
 */
When('I type {string} to {string}', async function (value: string, alias: string) {
    const element = await getElement(alias);
    const typeValue = await getValue(value);
    await element.type(typeValue);
});

/**
 * Click element
 * @param {string} alias - element to click
 * @example I click 'Google Button'
 */
When('I click {string}', async function (alias: string) {
    const element = await getElement(alias);
    await element.click();
});

/**
 * Right click element
 * @param {string} alias - element to right click
 * @example I right click 'Google Button'
 */
When('I right click {string}', async function (alias: string) {
    const element = await getElement(alias);
    await element.click({button: 'right'});
});

/**
 * Double click element
 * @param {string} alias - double element to click
 * @example I double click 'Google Button'
 */
When('I double click {string}', async function (alias: string) {
    const element = await getElement(alias);
    await element.dblclick();
});

/**
 * Clear input
 * @param {string} alias - element to clear
 * @example I clear 'Google Input'
 */
When('I clear {string}', async function (alias: string) {
    const element = await getElement(alias);
    await element.fill('');
});

/**
 * Switch to parent frame
 * @example I switch to parent frame
 */
When('I switch to parent frame', async function () {
    // @ts-ignore
    po.driver = page;
});

/**
 * Switch to frame by index
 * @param {number} index - index to switch
 * @example I switch to 2 frame
 */
When('I switch to {int} frame', async function (index: number) {
    // @ts-ignore
    po.driver = page.frames()[index];
});

/**
 * Switch to window by index
 * @param {number} index - index to switch
 * @example I switch to 2 window
 */
When('I switch to {int} window', async function (index: number) {
    global.context = browser.contexts()[index - 1];
    global.page = context.pages()[index - 1];
    //@ts-ignore
    po.driver = page;
});

/**
 * Refresh current page
 * @example I refresh page
 */
When('I refresh page', async function () {
    await page.reload();
});
