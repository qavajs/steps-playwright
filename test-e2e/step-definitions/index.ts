import { Then, When } from '@cucumber/cucumber';
import memory from '@qavajs/memory';
import {Browser, BrowserContext, Page} from 'playwright';

declare global {
    var browser: Browser;
    var driver: Browser;
    var context: BrowserContext;
    var page: Page;
    var config: any;
}
