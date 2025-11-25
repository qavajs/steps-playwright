import { ScreenshotEvent } from './screenshotEvent';
import { TraceEvent } from './traceEvent';
import { VideoEvent } from './videoEvent';
import { Status, type ITestStepHookParameter, type ITestCaseHookParameter, type DataTable } from '@qavajs/core';
import { join } from 'node:path';
import type { QavajsPlaywrightWorld } from '../QavajsPlaywrightWorld';

export function saveScreenshotAfterStep(config: any, step: ITestStepHookParameter): boolean {
    const screenshotEvent = getEventValue(config?.driverConfig?.screenshot);
    const isAfterStepScreenshot = equalOrIncludes(screenshotEvent, ScreenshotEvent.AFTER_STEP);
    const isOnFailScreenshot = equalOrIncludes(screenshotEvent, ScreenshotEvent.ON_FAIL);
    return (isOnFailScreenshot && step.result.status === Status.FAILED) || isAfterStepScreenshot
}

export function saveScreenshotBeforeStep(config: any): boolean {
    const screenshotEvent = getEventValue(config?.driverConfig?.screenshot);
    return equalOrIncludes(screenshotEvent, ScreenshotEvent.BEFORE_STEP)
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

/**
 * Parse 'x, y' string to coordinates object
 * @param {string} coords - 'x, y' string
 * @return {{x: number, y: number}} - coords object
 */
export function parseCoordsAsObject(coords: string): { x: number, y: number } {
    const [x, y] = coords.split(/\s?,\s?/).map((c: string) => parseFloat(c ?? 0));
    return {x, y}
}

export async function sleep(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(0), ms));
}

function getEventValue(entity: any) {
    return entity?.event
        ? entity.event
        : entity;
}

/**
 * Transform key-value data table to array
 * @param ctx
 * @param dataTable
 * @return {any[]}
 */
export function dataTable2Array(ctx: QavajsPlaywrightWorld, dataTable: DataTable): Promise<any[]> {
    return Promise.all(dataTable.raw().map(([value]) => ctx.getValue(value)));
}