import { IQavajsWorld } from '@qavajs/core';
import type { Locator, ElectronApplication } from '@playwright/test';
import { Playwright } from './playwright';

/**
 * Extends the qavajs world with Playwright browser automation capabilities.
 * @example
 * import { QavajsPlaywrightWorld } from '@qavajs/steps-playwright';
 * When('I click {string}', async function(this: QavajsPlaywrightWorld, alias) {
 *   await this.element(alias).click();
 * });
 */
export interface QavajsPlaywrightWorld extends IQavajsWorld {
    /** Active Playwright browser, context, and page handles */
    playwright: Playwright
    /** Resolve a page-object alias path to a Playwright Locator */
    element(path: string): Locator
}

/**
 * Extends {@link QavajsPlaywrightWorld} for Electron application testing,
 * replacing the browser/driver handles with an {@link ElectronApplication} instance.
 * @example
 * import { QavajsPlaywrightElectronWorld } from '@qavajs/steps-playwright';
 * When('I click {string}', async function(this: QavajsPlaywrightElectronWorld, alias) {
 *   await this.element(alias).click();
 * });
 */
export interface QavajsPlaywrightElectronWorld extends QavajsPlaywrightWorld {
    playwright: Playwright & { driver: ElectronApplication, browser: ElectronApplication }
}