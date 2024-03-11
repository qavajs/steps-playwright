import { When } from '@cucumber/cucumber';
import { getValue, getElement } from './transformers';
import { po } from '@qavajs/po-playwright';
import { expect, Browser, BrowserContext, Page } from '@playwright/test';
import { parseCoords, parseCoordsAsObject, sleep } from './utils/utils';

declare global {
    var browser: Browser;
    var driver: Browser;
    var context: BrowserContext;
    var page: Page;
    var config: any;
}

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
    await element.fill(typeValue);
});

/**
 * Type text to element sending fine-grained keyboard events
 * @param {string} alias - element to type
 * @param {string} value - value to type
 * @example I type 'wikipedia' chars to 'Google Input'
 */
When('I type {string} chars to {string}', async function (value: string, alias: string) {
    const element = await getElement(alias);
    const typeValue = await getValue(value);
    await element.pressSequentially(typeValue);
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
 * Click element via script
 * @param {string} alias - element to click
 * @example I force click 'Google Button'
 */
When('I force click {string}', async function (alias: string) {
    const element = await getElement(alias);
    await element.evaluate((e: HTMLElement) => e.click());
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
 * Switch to frame by alias
 * @param {string} index - alias to switch
 * @example I switch to 'IFrame' frame
 */
When('I switch to {string} frame', async function (frameAlias: string) {
    const frame = await getElement(frameAlias);
    const frameHandle = await frame.elementHandle();
    if (!frameHandle) throw new Error(`Frame '${frameHandle}' does not exist!`);
    // @ts-ignore
    po.driver = await frameHandle.contentFrame();
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
    await page.bringToFront();
});

/**
 * Switch to window by title or url
 * @param {string} matcher - url or title of window to switch
 * @example I switch to 'google' window
 */
When('I switch to {string} window', async function (matcher: string) {
    const urlOrTitle = await getValue(matcher);
    const poll = async () => {
        const pages = context.pages();
        for (const currentPage of pages) {
            if (currentPage.url().includes(urlOrTitle) || (await currentPage.title()).includes(urlOrTitle)) {
                return currentPage
            }
        }
    }
    await expect.poll(
        poll,
        {
            timeout: config.browser.timeout.page,
            message: `Page matching ${urlOrTitle} was not found`
        }
    ).toBeDefined();
    const targetPage = await poll() as Page;
    global.page = targetPage;
    (po as any).driver = targetPage;
    await targetPage.bringToFront();
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
 * @example I press 'Control+C' keys
 */
When('I press {string} key(s)', async function (key: string) {
    await page.press('body', key);
});

/**
 * Press button given number of times
 * @param {string} key - key to press
 * @param {number} num - number of times
 * @example I press 'Enter' key 5 times
 * @example I press 'Control+V' keys 5 times
 */
When('I press {string} key(s) {int} time(s)', async function (key: string, num: number) {
    for (let i: number = 0; i < num; i++) {
        await page.keyboard.press(key);
    }
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
 * @example I click '$someVarWithText' text in 'Search Engines' collection
 */
When(
    'I click {string} text in {string} collection',
    async function (value: string, alias: string) {
        const resolvedValue = await getValue(value);
        const collection = await getElement(alias);
        await collection.getByText(resolvedValue).click();
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
    await page.mouse.wheel(x, y);
});

/**
 * Scroll to element
 * @param {string} alias - alias of element
 * @example I scroll to 'Element'
 */
When('I scroll to {string}', async function (alias) {
    const element = await getElement(alias);
    await element.scrollIntoViewIfNeeded();
});

/**
 * Scroll by provided offset in element
 * @param {string} - offset string in 'x, y' format
 * @param {string} - element alias
 * @example
 * When I scroll by '0, 100' in 'Overflow Container'
 */
When('I scroll by {string} in {string}', async function (offset: string, alias: string) {
    const [x, y] = parseCoords(await getValue(offset));
    const element = await getElement(alias);
    await element.hover();
    await page.mouse.wheel(x, y);
});

/**
 * Scroll until specified element to be visible
 * @param {string} - target element
 * @example
 * When I scroll until 'Row 99' to be visible
 */
When('I scroll until {string} to be visible', async function (targetAlias: string) {
    const isVisible = async () => await (await getElement(targetAlias)).isVisible();
    while (!await isVisible()) {
        await page.mouse.wheel(0, 100);
        await sleep(50);
    }
});

/**
 * Scroll in container until specified element to be visible
 * @param {string} - scroll container
 * @param {string} - target element
 * @example
 * When I scroll in 'List' until 'Row 99' to be visible
 */
When('I scroll in {string} until {string} to be visible', async function (scrollAlias: string, targetAlias: string) {
    const element = await getElement(scrollAlias);
    await element.hover();
    const isVisible = async () => await (await getElement(targetAlias)).isVisible();
    while (!await isVisible()) {
        await page.mouse.wheel(0, 100);
        await sleep(50);
    }
});

/**
 * Provide file url to upload input
 * @param {string} alias - element to upload file
 * @param {string} value - file path
 * @example I upload '/folder/file.txt' to 'File Input'
 */
When('I upload {string} file to {string}', async function (value: string, alias: string) {
    const element = await getElement(alias);
    const filePath = await getValue(value);
    await element.setInputFiles(filePath);
});

/**
 * Provide file url to file chooser
 * @param {string} alias - element that invokes upload file chooser
 * @param {string} value - file path
 * @example I upload '/folder/file.txt' by clicking 'Upload Button'
 */
When('I upload {string} file by clicking {string}', async function (value: string, alias: string) {
    const fileChooserPromise = page.waitForEvent('filechooser');
    const button = await getElement(alias);
    await button.click();
    const fileChooser = await fileChooserPromise;
    const filePath = await getValue(value);
    await fileChooser.setFiles(filePath);
});

/**
 * Accept alert
 * @example I accept alert
 */
When('I accept alert', async function () {
    await new Promise<void>((resolve)=> page.once('dialog', async (dialog) => {
        await dialog.accept();
        resolve();
    }));
});

/**
 * Dismiss alert
 * Playwright automatically dismisses all dialogs. This step is just to make it implicitly.
 * @example I dismiss alert
 */
When('I dismiss alert', async function () {
    await new Promise<void>((resolve)=> page.once('dialog', async (dialog) => {
        await dialog.dismiss();
        resolve();
    }));
});

/**
 * I type {string} to alert
 * @example I type 'coffee' to alert
 */
When('I type {string} to alert', async function (value: string) {
    await new Promise<void>((resolve)=> page.once('dialog', async (dialog) => {
        await dialog.accept(value);
        resolve();
    }))
});

/**
 * Drag&Drop one element to another
 * @param {string} elementAlias - element to drag
 * @param {string} targetAlias - target
 * @example I drag and drop 'Bishop' to 'E4'
 */
When('I drag and drop {string} to {string}', async function (elementAlias, targetAlias) {
    const element = await getElement(elementAlias);
    const target = await getElement(targetAlias);
    await element.dragTo(target);
});

/**
 * Open new browser tab
 * @example I open new tab
 */
When('I open new tab', async function () {
    await page.evaluate(() => { window.open('about:blank', '_blank') });
});

/**
 * Close current tab
 * @example
 * Then I close current tab
 */
When('I close current tab', async function () {
    await page.close()
    global.page = context.pages()[0]
    if (global.page) {
        //@ts-ignore
        po.driver = page;
        await page.bringToFront();
    }
});

/**
 * Click certain coordinates in element
 * @param {string} coords - x, y coordinates to click
 * @param {string} alias - element to click
 * @example When I click '0, 20' coordinates in 'Element'
 */
When('I click {string} coordinates in {string}', async function (coords: string, alias: string) {
    const coordinates = await getValue(coords);
    const element = await getElement(alias);
    const coordsObject = typeof coordinates === 'string' ? parseCoordsAsObject(coordinates) : coordinates;
    await element.click({position: coordsObject});
});

/**
 * Resize browser's window
 * @param {string} size - desired size
 * @example I set window size '1366,768'
 */
When('I set window size {string}', async function (size: string) {
    const viewPort = await getValue(size);
    const {x, y} = parseCoordsAsObject(viewPort);
    await page.setViewportSize({width: x, height: y});
});

/**
 * Click browser button
 * @param {string} button - browser button
 * @example I click back button
 * @example I click forward button
 */
When('I click {playwrightBrowserButton} button', async function (button: 'back' | 'forward') {
    if (button === 'back') return page.goBack();
    if (button === 'forward') return page.goForward();
});

/**
 * Tap element
 * @param {string} alias - element to tap
 * @example I tap 'Google Button'
 */
When('I tap {string}', async function (alias: string) {
    const element = await getElement(alias);
    await element.tap();
});
