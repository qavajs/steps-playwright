import { ScreenshotEvent } from './screenshotEvent';
import { TraceEvent } from './traceEvent';
import { Status, ITestStepHookParameter, ITestCaseHookParameter } from '@cucumber/cucumber';
import { join } from 'path';

export function saveScreenshotAfterStep(config: any, step: ITestStepHookParameter): boolean {
    return (config.screenshot === ScreenshotEvent.ON_FAIL && step.result.status === Status.FAILED) ||
    config.screenshot === ScreenshotEvent.AFTER_STEP
}

export function saveScreenshotBeforeStep(config: any): boolean {
    return config.screenshot === ScreenshotEvent.BEFORE_STEP
}

export function saveTrace(driverConfig: any, scenario: ITestCaseHookParameter): boolean {
    return driverConfig?.trace && (
        (driverConfig?.trace.event === TraceEvent.AFTER_SCENARIO) ||
        (scenario.result?.status === Status.FAILED && driverConfig?.trace.event === TraceEvent.ON_FAIL)
    )
}

function normalizeScenarioName(name: string): string {
    return name.replace(/\W/g, '-')
}

export function traceArchive(driverConfig: any, scenario: ITestCaseHookParameter): string {
    return join(
        driverConfig.trace?.dir ?? 'traces',
        `${normalizeScenarioName(scenario.pickle.name)}-${scenario.testCaseStartedId}.zip`
    )
}
