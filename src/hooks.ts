import {
    BeforeAll,
    After,
    AfterAll,
    AfterStep,
    Before,
    BeforeStep,
    ITestCaseHookParameter,
    ITestStepHookParameter
} from '@qavajs/core';
import defaultTimeouts from './defaultTimeouts';
import {
    saveScreenshotAfterStep,
    saveScreenshotBeforeStep,
    saveVideo
} from './utils/utils';
import { readFile } from 'node:fs/promises';
import { createJSEngine } from './selectorEngines';
import playwright from './playwright';
import tracingManager from './utils/tracingManager';
import { element } from './pageObject';

BeforeAll(async function () {
    await createJSEngine();
});

Before({ name: 'Init playwright driver' }, async function () {
    const driverConfig = this.config.browser ?? this.config.driver;
    driverConfig.isElectron = driverConfig.capabilities.browserName === 'electron';
    driverConfig.timeout = {
        ...defaultTimeouts,
        ...driverConfig.timeout
    }
    this.config.driverConfig = driverConfig;
    if (this.config.driverConfig.video) {
       this.config.driverConfig.capabilities.recordVideo = this.config.driverConfig.video;
    }
    this.playwright = playwright;
    await this.playwright.launchDriver('default', this.config.driverConfig);
    await tracingManager.start(driverConfig, this);
    this.log(`driver instance started:\n${JSON.stringify(this.config.driverConfig, null, 2)}`);
    this.element = element;
});

BeforeStep(async function (step) {
    try {
        if (tracingManager.isTracingStarted) {
            await tracingManager.tracing.group(step.pickleStep.text);
        }
        if (saveScreenshotBeforeStep(this.config)) {
            this.attach(await this.playwright.page.screenshot({
                    fullPage: this.config.driverConfig?.screenshot?.fullPage
            }), 'image/png');
        }
    } catch (err) {
        console.warn(err)
    }
});

AfterStep(async function (step: ITestStepHookParameter) {
    try {
        if (tracingManager.isTracingStarted) {
            await tracingManager.tracing.groupEnd();
        }
        if (saveScreenshotAfterStep(this.config, step)) {
            this.attach(await this.playwright.page.screenshot({
                fullPage: this.config.driverConfig?.screenshot?.fullPage
            }), 'image/png');
        }
    } catch (err) {
        console.warn(err)
    }
});

After({ name: 'Shutdown playwright driver' }, async function (scenario: ITestCaseHookParameter) {
    await tracingManager.stop(this.config.driverConfig, this, scenario);
    await this.playwright.teardown({
        reuseSession:this.config.driverConfig.reuseSession,
        restartBrowser:this.config.driverConfig.restartBrowser,
    });
    if (saveVideo(this.config.driverConfig, scenario)) {
        if (this.config.driverConfig?.video.attach) {
            const video = this.playwright.page.video();
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
    await playwright.close();
});
