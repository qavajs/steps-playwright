import { saveTrace, traceArchive } from './utils';
import { readFile } from 'node:fs/promises';

class TracingManager {

    isTracingStarted = false;
    async start(driverConfig: any) {
        if (driverConfig.trace) {
            if (!driverConfig.reuseSession || (driverConfig.reuseSession && !this.isTracingStarted)) {
                this.isTracingStarted = true;
                await context.tracing.start({
                    screenshots: driverConfig.trace.screenshots ?? true,
                    snapshots: driverConfig.trace.snapshots ?? true,
                    sources: false
                });
            }
            await context.tracing.startChunk();
        }
    }

    async stop(driverConfig: any, world: any, scenario: any) {
        if (saveTrace(config.driverConfig, scenario)) {
            const path = traceArchive(config.driverConfig, scenario);
            try {
                await context.tracing.stopChunk({ path });
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
