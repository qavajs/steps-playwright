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
import playwright, { type Playwright } from './playwright';
import type { Browser, ElectronApplication, Video } from '@playwright/test';
import tracingManager from './utils/tracingManager';
import { element } from './pageObject';
import { QavajsPlaywrightWorld } from './QavajsPlaywrightWorld';
import type { PlaywrightCapabilities, PlaywrightDriverConfig, ResolvedDriverConfig } from './IQavajsPlaywrightConfig';

BeforeAll(async function () {
    await createJSEngine();
});

Before({ name: 'Init playwright driver' }, async function (this: QavajsPlaywrightWorld) {
    const userConfig: PlaywrightDriverConfig = this.config.browser ?? this.config.driver ?? {};
    const capabilities: PlaywrightCapabilities = { ...userConfig.capabilities };
    if (userConfig.video) {
        capabilities.recordVideo = userConfig.video as PlaywrightCapabilities['recordVideo'];
    }
    // resolve config into new object to keep user config untouched
    const driverConfig: ResolvedDriverConfig = {
        ...userConfig,
        capabilities,
        isElectron: capabilities.browserName === 'electron',
        timeout: {
            ...defaultTimeouts,
            ...userConfig.timeout
        }
    };
    this.config.driverConfig = driverConfig;
    this.playwright = playwright;
    await this.playwright.launchDriver('default', driverConfig);
    await tracingManager.start(driverConfig, this);
    this.log(`driver instance started:\n${JSON.stringify(driverConfig, null, 2)}`);
    this.element = element;
});

BeforeStep(async function (this: QavajsPlaywrightWorld, step) {
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

AfterStep(async function (this: QavajsPlaywrightWorld, step: ITestStepHookParameter) {
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

After({ name: 'Shutdown playwright driver' }, async function (this: QavajsPlaywrightWorld, scenario: ITestCaseHookParameter) {
    const driverConfig: ResolvedDriverConfig = this.config.driverConfig;
    await tracingManager.stop(driverConfig, this, scenario);
    const video = driverConfig.video ? this.playwright.page?.video() : null;
    const allVideos = driverConfig.video ? collectVideos(this.playwright) : [];
    await this.playwright.teardown({
        reuseSession: driverConfig.reuseSession,
        restartBrowser: driverConfig.restartBrowser,
    });
    if (!driverConfig.video) return;
    if (!video) {
        console.warn('Video was not recorded');
        return;
    }
    if (saveVideo(driverConfig, scenario)) {
        if (driverConfig.video.attach) {
            const videoPath = await video.path();
            const videoBuffer: Buffer = await readFile(videoPath);
            this.attach(videoBuffer.toString('base64'), 'base64:video/webm');
        }
    } else if (!driverConfig.reuseSession) {
        // video is finalized only when page is closed, so it can't be removed in reuseSession mode
        for (const pageVideo of allVideos) {
            try {
                await pageVideo.delete();
            } catch (err) {
                console.warn(`Video was not removed\n${err}`);
            }
        }
    }
});

/**
 * Videos of all pages opened in all drivers and contexts
 */
function collectVideos(pw: Playwright): Video[] {
    const pages = Object.values(pw.drivers).flatMap((driver: unknown) => {
        const electronApp = driver as ElectronApplication;
        return typeof electronApp.windows === 'function'
            ? electronApp.windows()
            : (driver as Browser).contexts().flatMap(context => context.pages());
    });
    return pages
        .map(page => page.video())
        .filter((video): video is Video => Boolean(video));
}

AfterAll(async function () {
    await playwright.close();
});
