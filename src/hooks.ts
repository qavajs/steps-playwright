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
    saveVideo
} from './utils/utils';
import { readFile } from 'node:fs/promises';
import { createJSEngine } from './selectorEngines';
import browserManager, {BrowserManager} from './browserManager';
import tracingManager from './utils/tracingManager';

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
    await tracingManager.start(driverConfig);
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
    await tracingManager.stop(config.driverConfig, this, scenario);
    await browserManager.teardown({ reuseSession: config.driverConfig.reuseSession });
    if (saveVideo(config.driverConfig, scenario)) {
        if (config.driverConfig?.video.attach) {
            const video = page.video();
            if (video) {
                const videoPath = await video.path();
                const zipBuffer: Buffer = await readFile(videoPath);
                this.attach(zipBuffer.toString('base64'), 'base64:video/webm');
            } else {
                console.warn('Video was not recorded');
            }
        }
    }
});

AfterAll(async function () {
    await browserManager.close();
});
