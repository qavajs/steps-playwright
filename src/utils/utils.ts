import {ScreenshotEvent} from './screenshotEvent';
import {TraceEvent} from './traceEvent';
import {VideoEvent} from './videoEvent';
import {Status, ITestStepHookParameter, ITestCaseHookParameter} from '@cucumber/cucumber';
import {join} from 'path';

export function saveScreenshotAfterStep(config: any, step: ITestStepHookParameter): boolean {
    const isAfterStepScreenshot = equalOrIncludes(config?.driverConfig.screenshot ?? config.screenshot, ScreenshotEvent.AFTER_STEP);
    const isOnFailScreenshot = equalOrIncludes(config?.driverConfig.screenshot ?? config.screenshot, ScreenshotEvent.ON_FAIL);
    return (isOnFailScreenshot && step.result.status === Status.FAILED) || isAfterStepScreenshot
}

export function saveScreenshotBeforeStep(config: any): boolean {
    return equalOrIncludes(config?.driverConfig.screenshot ?? config.screenshot, ScreenshotEvent.BEFORE_STEP)
}

export function saveTrace(driverConfig: any, scenario: ITestCaseHookParameter): boolean {
    return driverConfig?.trace && (
        (equalOrIncludes(driverConfig?.trace.event, TraceEvent.AFTER_SCENARIO)) ||
        (scenario.result?.status === Status.FAILED && equalOrIncludes(driverConfig?.trace.event, TraceEvent.ON_FAIL))
    )
}

export function saveVideo(driverConfig: any, scenario: ITestCaseHookParameter): boolean {
    return driverConfig?.video && (
        (equalOrIncludes(driverConfig?.video.event, VideoEvent.AFTER_SCENARIO)) ||
        (scenario.result?.status === Status.FAILED && equalOrIncludes(driverConfig?.video.event, VideoEvent.ON_FAIL))
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

export async function throwTimeoutError(fn: Function, message: string) {
    try {
        await fn()
    } catch (err: any) {
        if (err.message.includes('exceeded while waiting on the predicate')) {
            throw new Error(message);
        }
        throw err
    }
}

/**
 * Parse 'x, y' string to coordinates object
 * @param {string} coords - 'x, y' string
 * @return {{x: number, y: number}} - coords object
 */
export function parseCoordsAsObject(coords: string): { x: number, y: number } {
    const [x, y] = coords.split(/\s?,\s?/).map((c: string) => parseFloat(c ?? 0));
    return {x, y}
}
