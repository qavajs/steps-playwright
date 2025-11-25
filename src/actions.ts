import { type Page, type Locator } from '@playwright/test';
import { dataTable2Array, parseCoords, parseCoordsAsObject, sleep } from './utils/utils';
import { type DataTable, type MemoryValue, When } from '@qavajs/core';
import { QavajsPlaywrightWorld } from './QavajsPlaywrightWorld';

/**
 * Opens provided url
 * @param {string} url - url to navigate
 * @example I open 'https://google.com'
 */
When('I open {value} url', async function (this: QavajsPlaywrightWorld, url: MemoryValue): Promise<void> {
    await this.playwright.page.goto(await url.value());
});

/**
 * Type text to element
 * @param {string} alias - element to type
 * @param {string} value - value to type
 * @example I type 'wikipedia' to 'Google Input'
 * @example I type 'wikipedia' into 'Google Input'
 */
When('I type {value} (in)to {playwrightLocator}', async function (this: QavajsPlaywrightWorld, value: MemoryValue, locator: Locator): Promise<void> {
    const typeValue = await value.value();
    await locator.fill(typeValue);
});

/**
 * Type text to element sending fine-grained keyboard events
 * @param {string} alias - element to type
 * @param {string} value - value to type
 * @example I type 'wikipedia' chars to 'Google Input'
 * @example I type 'wikipedia' chars into 'Google Input'
 */
When('I type {value} chars (in)to {playwrightLocator}', async function (this: QavajsPlaywrightWorld, value: MemoryValue, locator: Locator) {
    const typeValue = await value.value();
    await locator.pressSequentially(typeValue);
});

/**
 * Click element
 * @param {string} alias - element to click
 * @example I click 'Google Button'
 */
When('I click {playwrightLocator}', async function (this: QavajsPlaywrightWorld, locator: Locator) {
    await locator.click();
});

/**
 * Click element via script
 * @param {string} alias - element to click
 * @example I force click 'Google Button'
 */
When('I force click {playwrightLocator}', async function (this: QavajsPlaywrightWorld, locator: Locator) {
    await locator.evaluate((e: HTMLElement) => e.click());
});

/**
 * Right click element
 * @param {string} alias - element to right click
 * @example I right click 'Google Button'
 */
When('I right click {playwrightLocator}', async function (this: QavajsPlaywrightWorld, locator: Locator) {
    await locator.click({ button: 'right' });
});

/**
 * Double click element
 * @param {string} alias - double element to click
 * @example I double click 'Google Button'
 */
When('I double click {playwrightLocator}', async function (this: QavajsPlaywrightWorld, locator: Locator) {
    await locator.dblclick();
});

/**
 * Clear input
 * @param {string} alias - element to clear
 * @example I clear 'Google Input'
 */
When('I clear {playwrightLocator}', async function (this: QavajsPlaywrightWorld, locator: Locator) {
    await locator.clear();
});

/**
 * Switch to window by index
 * @param {number} index - index to switch
 * @example I switch to 2 window
 */
When('I switch to {int} window', async function (this: QavajsPlaywrightWorld, index: number) {
    await this.playwright.expect.poll(
        () => this.playwright.context.pages().length,
        { timeout:this.config.browser.timeout.page }
    ).toBeGreaterThan(index - 1);
    this.playwright.setPage(this.playwright.context.pages().at(index - 1) as Page)
    await this.playwright.page.bringToFront();
});

/**
 * Switch to window by title or url
 * @param {string} matcher - url or title of window to switch
 * @example I switch to 'google' window
 */
When('I switch to {value} window', async function (this: QavajsPlaywrightWorld, matcher: MemoryValue) {
    const urlOrTitle = await matcher.value();
    const poll = async () => {
        const pages = this.playwright.context.pages();
        for (const currentPage of pages) {
            if (currentPage.url().includes(urlOrTitle) || (await currentPage.title()).includes(urlOrTitle)) {
                return currentPage
            }
        }
    }
    await this.playwright.expect.poll(
        poll,
        {
            timeout: this.config.browser.timeout.page,
            message: `Page matching ${urlOrTitle} was not found`
        }
    ).toBeDefined();
    const targetPage = await poll() as Page;
    await targetPage.bringToFront();
    this.playwright.setPage(targetPage);
});

/**
 * Refresh current page
 * @example I refresh page
 */
When('I refresh page', async function (this: QavajsPlaywrightWorld, ) {
    await this.playwright.page.reload();
});

/**
 * Press button
 * @param {string} key - key to press
 * @example I press 'Enter' key
 * @example I press 'Control+C' keys
 */
When('I press {string} key(s)', async function (this: QavajsPlaywrightWorld, key: string) {
    await this.playwright.page.press('body', key);
});

/**
 * Press button given number of times
 * @param {string} key - key to press
 * @param {number} num - number of times
 * @example I press 'Enter' key 5 times
 * @example I press 'Control+V' keys 5 times
 */
When('I press {string} key(s) {int} time(s)', async function (this: QavajsPlaywrightWorld, key: string, num: number) {
    for (let i: number = 0; i < num; i++) {
        await this.playwright.page.keyboard.press(key);
    }
});

/**
 * Hover over element
 * @param {string} alias - element to hover over
 * @example I hover over 'Google Button'
 */
When('I hover over {playwrightLocator}', async function (this: QavajsPlaywrightWorld, locator: Locator) {
    await locator.hover();
});

/**
 * Select option with certain text from select element
 * @param {string} option - option to select
 * @param {string} alias - alias of select
 * @example I select '1900' option from 'Registration Form > Date Of Birth'
 * @example I select '$dateOfBirth' option from 'Registration Form > Date Of Birth' dropdown
 */
When('I select {value} option from {playwrightLocator} dropdown', async function (this: QavajsPlaywrightWorld, option: MemoryValue, locator: Locator) {
    await locator.selectOption({ label: await option.value() });
});

/**
 * Select option with certain text from select element
 * @param {number} optionIndex - index of option to select
 * @param {string} alias - alias of select
 * @example I select 1 option from 'Registration Form > Date Of Birth' dropdown
 */
When('I select {int}(st|nd|rd|th) option from {playwrightLocator} dropdown', async function (this: QavajsPlaywrightWorld, optionIndex: number, locator: Locator) {
    await locator.selectOption({ index: optionIndex - 1 });
});

/**
 * Click on element with desired text in collection
 * @param {string} expectedText - text to click
 * @param {string} alias - collection to search text
 * @example I click 'google' text in 'Search Engines' collection
 * @example I click '$someVarWithText' text in 'Search Engines' collection
 */
When(
    'I click {value} text in {playwrightLocator} collection',
    async function (text: MemoryValue, locator: Locator) {
        await locator.getByText(await text.value()).click();
    }
);

/**
 * Scroll by provided offset
 * @param {string} - offset string in 'x, y' format
 * @example
 * When I scroll by '0, 100'
 */
When('I scroll by {value}', async function (this: QavajsPlaywrightWorld, offset: MemoryValue) {
    const [x, y] = parseCoords(await offset.value());
    await this.playwright.page.mouse.wheel(x, y);
});

/**
 * Scroll to element
 * @param {string} alias - alias of element
 * @example I scroll to 'Element'
 */
When('I scroll to {playwrightLocator}', async function (this: QavajsPlaywrightWorld, locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
});

/**
 * Scroll by provided offset in element
 * @param {string} - offset string in 'x, y' format
 * @param {string} - element alias
 * @example
 * When I scroll by '0, 100' in 'Overflow Container'
 */
When('I scroll by {value} in {playwrightLocator}', async function (this: QavajsPlaywrightWorld, offset: MemoryValue, locator: Locator) {
    const [x, y] = parseCoords(await offset.value());
    await locator.hover();
    await this.playwright.page.mouse.wheel(x, y);
});

/**
 * Scroll until specified element to be visible
 * @param {string} - target element
 * @example
 * When I scroll until 'Row 99' to be visible
 */
When('I scroll until {playwrightLocator} to be visible', async function (this: QavajsPlaywrightWorld, locator: Locator) {
    const isVisible = async () => await locator.isVisible();
    while (!await isVisible()) {
        await this.playwright.page.mouse.wheel(0, 100);
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
When('I scroll in {playwrightLocator} until {playwrightLocator} to be visible', async function (this: QavajsPlaywrightWorld, scrollLocator: Locator, targetLocator: Locator) {
    await scrollLocator.hover();
    const isVisible = async () => await targetLocator.isVisible();
    while (!await isVisible()) {
        await this.playwright.page.mouse.wheel(0, 100);
        await sleep(50);
    }
});

/**
 * Save a file to relative path
 * @param {string} pathAlias - file path
 * @param {string} initiatorAlias - alias of an element triggering downloading process
 * @example I save file to './folder/file.pdf' by clicking 'Download Button'
 */
When('I save file to {value} by clicking {playwrightLocator}', async function (this: QavajsPlaywrightWorld, path: MemoryValue, locator: Locator) {
    const downloadPromise = this.playwright.page.waitForEvent('download');
    await locator.click();
    const download = await downloadPromise;
    await download.saveAs(await path.value());
});

/**
 * Provide file url to upload input
 * @param {string} alias - element to upload file
 * @param {string} value - file path
 * @example I upload '/folder/file.txt' to 'File Input'
 */
When('I upload {value} file to {playwrightLocator}', async function (this: QavajsPlaywrightWorld, filePath: MemoryValue, locator: Locator) {
    await locator.setInputFiles(await filePath.value());
});

/**
 * Provide multiple file urls to file chooser
 * @param {string} alias - element that invokes upload file chooser
 * @param {string} value - file path
 * @example I upload files by clicking 'Upload Button':
 * | path1 |
 * | path2 |
 */
When('I upload files by clicking {playwrightLocator}:', async function (this: QavajsPlaywrightWorld, locator: Locator, dataTable: DataTable) {
    const fileChooserPromise = this.playwright.page.waitForEvent('filechooser');
    await locator.click();
    const fileChooser = await fileChooserPromise;
    const filesArray = await dataTable2Array(this, dataTable)
    await fileChooser.setFiles(filesArray);
});

/**
 * Provide file url to file chooser
 * @param {string} alias - element that invokes upload file chooser
 * @param {string} value - file path
 * @example I upload '/folder/file.txt' by clicking 'Upload Button'
 */
When('I upload {value} file by clicking {playwrightLocator}', async function (this: QavajsPlaywrightWorld, filePath: MemoryValue, locator: Locator) {
    const fileChooserPromise = this.playwright.page.waitForEvent('filechooser');
    await locator.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(await filePath.value());
});

/**
 * Drag&Drop one element to another
 * @param {string} elementAlias - element to drag
 * @param {string} targetAlias - target
 * @example I drag and drop 'Bishop' to 'E4'
 */
When('I drag and drop {playwrightLocator} to {playwrightLocator}', async function (this: QavajsPlaywrightWorld, locator: Locator, target: Locator) {
    await locator.dragTo(target);
});

/**
 * Open new browser tab
 * @example I open new tab
 */
When('I open new tab', async function (this: QavajsPlaywrightWorld, ) {
    await this.playwright.page.evaluate(() => { window.open('about:blank', '_blank') });
});

/**
 * Close current tab
 * @example
 * Then I close current tab
 */
When('I close current tab', async function (this: QavajsPlaywrightWorld, ) {
    await this.playwright.page.close();
    const page = this.playwright.context.pages().at(0);
    if (page) {
        this.playwright.setPage(page);
        await page.bringToFront();
    }
});

/**
 * Click certain coordinates in element
 * @param {string} coords - x, y coordinates to click
 * @param {string} alias - element to click
 * @example When I click '0, 20' coordinates in 'Element'
 */
When('I click {value} coordinates in {playwrightLocator}', async function (this: QavajsPlaywrightWorld, coords: MemoryValue, locator: Locator) {
    const coordinates = await coords.value();
    const coordsObject = typeof coordinates === 'string' ? parseCoordsAsObject(coordinates) : coordinates;
    await locator.click({position: coordsObject});
});

/**
 * Resize browser's window
 * @param {string} size - desired size
 * @example I set window size '1366,768'
 */
When('I set window size {value}', async function (this: QavajsPlaywrightWorld, viewPort: MemoryValue) {
    const {x, y} = parseCoordsAsObject(await viewPort.value());
    await this.playwright.page.setViewportSize({width: x, height: y});
});

/**
 * Click browser button
 * @param {string} button - browser button
 * @example I click back button
 * @example I click forward button
 */
When('I click {playwrightBrowserButton} button', async function (this: QavajsPlaywrightWorld, button: 'back' | 'forward') {
    if (button === 'back') return this.playwright.page.goBack();
    if (button === 'forward') return this.playwright.page.goForward();
});

/**
 * Tap element
 * @param {string} alias - element to tap
 * @example I tap 'Google Button'
 */
When('I tap {playwrightLocator}', async function (this: QavajsPlaywrightWorld, locator: Locator) {
    await locator.tap();
});

/**
 * Grants specified permission to the browser this.playwright.context.
 * @param {string} permissionAlias - permission alias.
 * @example I grant 'geolocation' permission
 * Permissions documentation can be found here https://playwright.dev/docs/api/class-browsercontext#browser-context-grant-permissions-option-permissions
 */
When('I grant {value} permission', async function (this: QavajsPlaywrightWorld, permission: MemoryValue) {
    await this.playwright.context.grantPermissions([await permission.value()]);
});

/**
 * Clears all permission overrides for the browser this.playwright.context.
 */
When('I revoke browser permissions', async function (this: QavajsPlaywrightWorld, ) {
    await this.playwright.context.clearPermissions();
});

/**
 * Sets a geolocation for a current this.playwright.context.
 * @param {string} geolocationAlias - geolocation memory alias.
 * @example I set '$minsk' geolocation
 * where '$minsk' is memory alias of location object { latitude: 53.53, longitude: 27.34 };
 * Passing null or undefined emulates position unavailable.
 */
When('I set {value} geolocation', async function (this: QavajsPlaywrightWorld, geolocation: MemoryValue) {
    await this.playwright.context.setGeolocation(await geolocation.value());
});
