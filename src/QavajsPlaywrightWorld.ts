import { IQavajsWorld } from '@qavajs/core';
import type { Locator, ElectronApplication } from '@playwright/test';
import { Playwright } from './playwright';

export interface QavajsPlaywrightWorld extends IQavajsWorld {
    playwright: Playwright
    element(path: string): Locator
}

export interface QavajsPlaywrightElectronWorld extends QavajsPlaywrightWorld {
    playwright: Playwright & { driver: ElectronApplication, browser: ElectronApplication }
}