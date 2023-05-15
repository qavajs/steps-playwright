import { Browser, BrowserContext, Page } from 'playwright';

declare global {
    var browser: Browser;
    var driver: Browser;
    var context: BrowserContext;
    var page: Page;
}
