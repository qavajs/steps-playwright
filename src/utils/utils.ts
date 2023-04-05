import { ScreenshotEvent } from './screenshotEvent';
import { TraceEvent } from './traceEvent';
import { Status, ITestStepHookParameter, ITestCaseHookParameter } from '@cucumber/cucumber';
import { join } from 'path';

export function saveScreenshotAfterStep(config: any, step: ITestStepHookParameter): boolean {
    const isAfterStepScreenshot = equalOrIncludes(config.screenshot, ScreenshotEvent.AFTER_STEP);
    const isOnFailScreenshot = equalOrIncludes(config.screenshot, ScreenshotEvent.ON_FAIL);
    return (isOnFailScreenshot && step.result.status === Status.FAILED) || isAfterStepScreenshot
}

export function saveScreenshotBeforeStep(config: any): boolean {
    return equalOrIncludes(config.screenshot, ScreenshotEvent.BEFORE_STEP)
}

export function saveTrace(driverConfig: any, scenario: ITestCaseHookParameter): boolean {
    return driverConfig?.trace && (
        (equalOrIncludes(driverConfig?.trace.event, TraceEvent.AFTER_SCENARIO)) ||
        (scenario.result?.status === Status.FAILED && equalOrIncludes(driverConfig?.trace.event, TraceEvent.ON_FAIL))
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

/**
 * Parse 'x, y' string to coordinates array
 * @param {string} coords - 'x, y' string
 * @return {number[]} - coords array
 */
export function parseCoords(coords: string): number[] {
    return coords.split(/\s?,\s?/).map((c: string) => parseFloat(c ?? 0))
}

export function equalOrIncludes(value: string | string[], argument: string) {
    return Array.isArray(value)
        ? value.includes(argument)
        : value === argument;
}
