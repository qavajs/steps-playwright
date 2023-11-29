import { Browser, BrowserContext, Page } from 'playwright';
import { BrowserManager } from './src/browserManager';

declare global {
    var browser: Browser;
    var driver: Browser;
    var context: BrowserContext;
    var page: Page;
    var browserManager: BrowserManager
}
