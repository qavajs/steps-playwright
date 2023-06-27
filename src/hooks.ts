import {
    After,
    AfterAll,
    AfterStep,
    Before,
    BeforeStep,
    ITestCaseHookParameter,
    ITestStepHookParameter
} from '@cucumber/cucumber';
import defaultTimeouts from './defaultTimeouts';
import { Browser, BrowserContext, Page } from 'playwright';
import { po } from '@qavajs/po-playwright';
import { driverProvider } from './driverProvider';
import {
    saveScreenshotAfterStep,
    saveScreenshotBeforeStep,
    saveTrace,
    saveVideo,
    traceArchive
} from './utils/utils';
import { readFile } from 'fs/promises';

declare global {
    var browser: Browser;
    var driver: Browser;
    var context: BrowserContext;
    var page: Page;
    var config: any;
    var contexts: {
        [contextName: string]: BrowserContext
    } | null;
}

Before(async function () {
    const driverConfig = config.browser ?? config.driver;
    driverConfig.timeout = {
        ...defaultTimeouts,
        ...driverConfig.timeout
    }
    config.driverConfig = driverConfig;
    global.browser = global.browser ? global.browser : await driverProvider(config.driverConfig);
    if (config.driverConfig.video) {
        config.driverConfig.capabilities.recordVideo = config.driverConfig.video;
    }
    global.context = await browser.newContext(config?.driverConfig?.capabilities);
    if (config.driverConfig.trace) {
        await context.tracing.start({
            screenshots: true,
            snapshots: true
        })
    }
    global.page = await context.newPage();
    global.driver = global.browser;
    po.init(page, { timeout: config.driverConfig.timeout.present });
    po.register(config.pageObject);
    this.log(`browser instance started:\n${JSON.stringify(config.driverConfig, null, 2)}`);
});

BeforeStep(async function () {
    if (saveScreenshotBeforeStep(config)) {
        try {
            this.attach(await page.screenshot(), 'image/png');
        } catch (err) {
            console.warn(err)
        }
    }
});

AfterStep(async function (step: ITestStepHookParameter) {
    try {
        if (saveScreenshotAfterStep(config, step)) {
            this.attach(await page.screenshot(), 'image/png');
        }
    } catch (err) {
        console.warn(err)
    }
});

After(async function (scenario: ITestCaseHookParameter) {
    const videoPath = await page.video()?.path() ?? '';
    if (saveTrace(config.driverConfig, scenario)) {
        const path = traceArchive(config.driverConfig, scenario);
        await context.tracing.stop({ path });
        if (config.driverConfig?.trace.attach) {
            const zipBuffer: Buffer = await readFile(path);
            this.attach(zipBuffer.toString('base64'), 'base64:application/zip');
        }
    }
    if (global.browser) {
        if (global.contexts) {
            for (const contextName in global.contexts) {
                await global.contexts[contextName].close();
                this.log(`${contextName} context closed`);
            }
            global.contexts = null;
        } else {
            await context.close();
            this.log('browser context closed');
        }
    }
    if (saveVideo(config.driverConfig, scenario)) {
        if (config.driverConfig?.video.attach) {
            const zipBuffer: Buffer = await readFile(videoPath);
            this.attach(zipBuffer.toString('base64'), 'base64:video/webm');
        }
    }
});

AfterAll(async function () {
    if (global.browser) {
        await browser.close();
    }
});
