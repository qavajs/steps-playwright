import {
    BeforeAll,
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
import {
    saveScreenshotAfterStep,
    saveScreenshotBeforeStep,
    saveTrace,
    saveVideo,
    traceArchive
} from './utils/utils';
import { readFile } from 'node:fs/promises';
import { createJSEngine } from './selectorEngines';
import browserManager, {BrowserManager} from './browserManager';

declare global {
    var browser: Browser
    var driver: Browser;
    var context: BrowserContext;
    var page: Page;
    var config: any;
    var browserManager: BrowserManager
}

BeforeAll(async function () {
    await createJSEngine();
});

Before({name: 'Init'}, async function () {
    const driverConfig = config.browser ?? config.driver;
    driverConfig.isElectron = driverConfig.capabilities.browserName === 'electron';
    driverConfig.timeout = {
        ...defaultTimeouts,
        ...driverConfig.timeout
    }
    config.driverConfig = driverConfig;
    if (config.driverConfig.video) {
        config.driverConfig.capabilities.recordVideo = config.driverConfig.video;
    }
    await browserManager.launchDriver('default', config.driverConfig);
    if (config.driverConfig.trace) {
        await context.tracing.start({
            screenshots: true,
            snapshots: true
        });
    }
    po.init(page, { timeout: config.driverConfig.timeout.present, logger: this });
    po.register(config.pageObject);
    global.browserManager = browserManager;
    this.log(`driver instance started:\n${JSON.stringify(config.driverConfig, null, 2)}`);
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

After({name: 'Teardown'}, async function (scenario: ITestCaseHookParameter) {
    if (saveTrace(config.driverConfig, scenario)) {
        const path = traceArchive(config.driverConfig, scenario);
        await context.tracing.stop({ path });
        if (config.driverConfig?.trace.attach) {
            const zipBuffer: Buffer = await readFile(path);
            this.attach(zipBuffer.toString('base64'), 'base64:application/zip');
        }
    }
    await browserManager.teardown();
    if (saveVideo(config.driverConfig, scenario)) {
        if (config.driverConfig?.video.attach) {
            const videoPath = await page.video()?.path() ?? '';
            const zipBuffer: Buffer = await readFile(videoPath);
            this.attach(zipBuffer.toString('base64'), 'base64:video/webm');
        }
    }
});

AfterAll(async function () {
    await browserManager.close();
});
