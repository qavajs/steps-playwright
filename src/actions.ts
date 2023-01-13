import { When } from '@cucumber/cucumber';
import { getValue, getElement } from './transformers';
import { po } from '@qavajs/po-playwright';
import { expect } from '@playwright/test';
import { parseCoords } from './utils/utils';

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
    await expect.poll(
        () => page.frames()?.length,
        { timeout: config.browser.timeout.page }
    ).toBeGreaterThan(index);
    // @ts-ignore
    po.driver = page.frames()[index];
});

/**
 * Switch to window by index
 * @param {number} index - index to switch
 * @example I switch to 2 window
 */
When('I switch to {int} window', async function (index: number) {
    await expect.poll(
        () => context.pages()?.length,
        { timeout: config.browser.timeout.page }
    ).toBeGreaterThan(index - 1);
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

/**
 * Press button
 * @param {string} key - key to press
 * @example I press 'Enter' key
 */
When('I press {string} key', async function (key: string) {
    await page.press('body', key);
});

/**
 * Hover over element
 * @param {string} alias - element to hover over
 * @example I hover over 'Google Button'
 */
When('I hover over {string}', async function (alias: string) {
    const element = await getElement(alias);
    await element.hover();
});

/**
 * Select option with certain text from select element
 * @param {string} option - option to select
 * @param {string} alias - alias of select
 * @example I select '1900' option from 'Registration Form > Date Of Birth'
 * @example I select '$dateOfBirth' option from 'Registration Form > Date Of Birth' dropdown
 */
When('I select {string} option from {string} dropdown', async function (option: string, alias: string) {
    const optionValue = await getValue(option);
    const select = await getElement(alias);
    await select.selectOption({ label: optionValue });
});

/**
 * Select option with certain text from select element
 * @param {number} optionIndex - index of option to select
 * @param {string} alias - alias of select
 * @example I select 1 option from 'Registration Form > Date Of Birth' dropdown
 */
When('I select {int}(st|nd|rd|th) option from {string} dropdown', async function (optionIndex: number, alias: string) {
    const select = await getElement(alias);
    await select.selectOption({ index: optionIndex - 1 });
});

/**
 * Click on element with desired text in collection
 * @param {string} expectedText - text to click
 * @param {string} alias - collection to search text
 * @example I click 'google' text in 'Search Engines' collection
 */
When(
    'I click {string} text in {string} collection',
    async function (value: string, alias: string) {
        const collection = await getElement(alias);
        await collection.getByText(value).click();
    }
);

/**
 * Scroll by provided offset
 * @param {string} - offset string in 'x, y' format
 * @example
 * When I scroll by '0, 100'
 */
When('I scroll by {string}', async function (offset: string) {
    const [x, y] = parseCoords(await getValue(offset));
    await page.evaluate(function (coords) {
        window.scrollBy(...coords as [number, number]);
    }, [x, y]);
});

/**
 * Scroll by provided offset in element
 * @param {string} - offset string in 'x, y' format
 * @param {string} - element alias
 * @example
 * When I scroll by '0, 100' in 'Overflow Container'
 */
When('I scroll by {string} in {string}', async function (offset: string, alias: string) {
    const coords = parseCoords(await getValue(offset));
    const element = await getElement(alias);
    await element.evaluate(function (element, coords) {
        element.scrollBy(...coords as [number, number]);
    }, coords);
});
