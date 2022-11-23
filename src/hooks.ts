import { After, AfterStep, Before, BeforeStep, Status } from '@cucumber/cucumber';
import defaultTimeouts from './defaultTimeouts';
import { chromium, firefox, webkit, Browser, BrowserContext, Page, BrowserType } from 'playwright';
import { po } from '@qavajs/po-playwright';
import { ScreenshotEvent } from './screenshotEvent';
const browsers: any = { chromium, firefox, webkit };

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
    const browserName: string = driverConfig?.capabilities?.browserName ?? 'chromium';
    const browserType: BrowserType = browsers[browserName];
    if (driverConfig?.capabilities?.wsEndpoint) {
        global.browser = await browserType.connect(
            driverConfig?.capabilities?.wsEndpoint,
            driverConfig.capabilities
        )
    } else {
        global.browser = await browserType.launch(driverConfig.capabilities);
    }
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
