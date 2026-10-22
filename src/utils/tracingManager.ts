import { saveTrace, traceArchive } from './utils';
import { readFile } from 'node:fs/promises';
import type { Tracing } from '@playwright/test';
import type { ITestCaseHookParameter } from '@qavajs/core';
import type { ResolvedDriverConfig } from '../IQavajsPlaywrightConfig';
import type { QavajsPlaywrightWorld } from '../QavajsPlaywrightWorld';

class TracingManager {

    isTracingStarted = false;
    tracing!: Tracing;

    async start(driverConfig: ResolvedDriverConfig, world: QavajsPlaywrightWorld) {
        if (driverConfig.trace) {
            if (!driverConfig.reuseSession || (driverConfig.reuseSession && !this.isTracingStarted)) {
                this.isTracingStarted = true;
                this.tracing = world.playwright.context.tracing;
                await this.tracing.start({
                    screenshots: driverConfig.trace.screenshots ?? true,
                    snapshots: driverConfig.trace.snapshots ?? true,
                    sources: false
                });
            }
            await world.playwright.context.tracing.startChunk();
        }
    }

    async stop(driverConfig: ResolvedDriverConfig, world: QavajsPlaywrightWorld, scenario: ITestCaseHookParameter) {
        if (!driverConfig.trace || !this.isTracingStarted) return;
        if (!saveTrace(driverConfig, scenario)) {
            // chunk has to be closed anyway, otherwise next scenario can't start new chunk in reuseSession mode
            try {
                await this.tracing.stopChunk();
            } catch (err) {
                console.warn(`Trace chunk was not stopped\n${err}`);
            }
            return;
        }
        const path = traceArchive(driverConfig, scenario);
        try {
            await this.tracing.stopChunk({ path });
            if (driverConfig.trace.attach) {
                const zipBuffer: Buffer = await readFile(path);
                world.attach(zipBuffer.toString('base64'), 'base64:application/zip');
            }
        } catch (err) {
            console.warn(`Trace was not recorded\n${err}`);
        }
    }
}

export default new TracingManager();
