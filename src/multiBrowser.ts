import { When } from '@cucumber/cucumber';
import browserManager from './browserManager';
import { getValue } from './transformers';

/**
 * Launch new driver
 * @param {string} driverName - driver name
 * @example
 * When I launch new driver as 'browser2'
 */
When('I launch new driver as {string}', async function (driverName: string) {
    await browserManager.launchDriver(driverName, config?.driverConfig);
});

/**
 * Open new driver with provided config
 * @param {string} driverName - driver name
 * @param {string} config - json with browser config
 * @example
 * When I launch new driver as 'browser2'
 */
When('I launch new driver as {string}:', async function (driverName: string, rawConfig: string) {
    const config = await getValue(rawConfig);
    await browserManager.launchDriver(driverName, JSON.parse(config));
});

/**
 * Switch to driver
 * @param {string} driverName - driver name
 * @example
 * When I launch new driver as 'browser2'
 * And I switch to 'browser2' driver
 * And I switch to 'default' driver
 */
When('I switch to {string} driver', async function (driverName: string) {
    await browserManager.switchDriver(driverName);
});

/**
 * Close driver
 * @param {string} driverName - driver name
 * @example
 * When I close to 'browser2' driver
 */
When('I close {string} driver', async function (driverName: string) {
    await browserManager.closeDriver(driverName);
});

/**
 * Open new browser context
 * @param {string} browserContextName - browser context name
 * @example
 * When I open new browser context as 'browser2'
 */
When('I open new browser context as {string}', async function (browserContextName: string) {
    await browserManager.launchContext(browserContextName, config?.driverConfig);
});

/**
 * Switch to browser context
 * @param {string} browserContextName - browser context name
 * @example
 * When I open new browser context as 'browser2'
 * And I switch to 'browser2' browser context
 * And I switch to 'default' browser context
 */
When('I switch to {string} browser context', async function (browserContextName: string) {
    await browserManager.switchContext(browserContextName);
});

/**
 * Close browser context
 * @param {string} browserContextName - browser context name
 * @example
 * When I close to 'browser2' browser context
 */
When('I close {string} browser context', async function (browserContextName: string) {
    await browserManager.closeContext(browserContextName);
});


