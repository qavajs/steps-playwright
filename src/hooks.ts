import { After, AfterStep, Before, BeforeStep, Status } from '@cucumber/cucumber';
import defaultTimeouts from './defaultTimeouts';
import { Browser, BrowserContext, Page } from 'playwright';
import { po } from '@qavajs/po-playwright';
import { ScreenshotEvent } from './screenshotEvent';
import { driverProvider } from './driverProvider';

declare global {
    var browser: Browser;
    var driver: Browser;
    var context: BrowserContext;
    var page: Page;
    var config: any;
}

Before(async function () {
    const driverConfig = config.browser ?? config.driver;
    driverConfig.timeout = {
        defaultTimeouts,
        ...driverConfig.timeout
    }
    global.browser = await driverProvider(driverConfig);
    global.context = await browser.newContext();
    global.page = await browser.newPage({ viewport: null });
    global.driver = global.browser;
    po.init(page, { timeout: driverConfig.timeout.present });
    po.register(config.pageObject);
});

BeforeStep(async function () {
    if (config.screenshot === ScreenshotEvent.BEFORE_STEP) {
        try {
            this.attach(await page.screenshot(), 'image/png');
        } catch (err) {
            console.warn(err)
        }
    }
});

AfterStep(async function (step) {
    try {
        if (
            (config.screenshot === ScreenshotEvent.ON_FAIL && step.result.status === Status.FAILED) ||
            config.screenshot === ScreenshotEvent.AFTER_STEP
        ) {
            this.attach(await page.screenshot(), 'image/png');
        }
    } catch (err) {
        console.warn(err)
    }
});

After(async function () {
    if (global.browser) {
        await browser.close();
    }
});
