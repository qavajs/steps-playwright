import { saveTrace, traceArchive } from './utils';
import { readFile } from 'node:fs/promises';
import { Tracing } from '@playwright/test';

class TracingManager {

    isTracingStarted = false;
    tracing!: Tracing;

    async start(driverConfig: any, world: any) {
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

    async stop(driverConfig: any, world: any, scenario: any) {
        if (saveTrace(driverConfig, scenario)) {
            const path = traceArchive(driverConfig, scenario);
            try {
                await this.tracing.stopChunk({ path });
                if (driverConfig?.trace.attach) {
                    const zipBuffer: Buffer = await readFile(path);
                    world.attach(zipBuffer.toString('base64'), 'base64:application/zip');
                }
            } catch (err) {
                console.warn('Trace was not recorded');
            }
        }
    }
}

export default new TracingManager();
