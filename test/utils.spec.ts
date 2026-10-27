import { describe, test, expect } from 'vitest';
import { Status } from '@qavajs/core';
import {
    saveScreenshotAfterStep,
    saveScreenshotBeforeStep,
    saveTrace,
    saveVideo,
    traceArchive,
    parseCoords,
    parseCoordsAsObject,
    equalOrIncludes,
    dataTable2Array
} from '../src/utils/utils';

const step = (status: string): any => ({ result: { status } });
const scenario = (status: string): any => ({
    result: { status },
    pickle: { name: 'my scenario: #1' },
    testCaseStartedId: 'id'
});

describe('screenshot', () => {
    test.each([
        [{ screenshot: 'onFail' }, Status.FAILED, true],
        [{ screenshot: 'onFail' }, Status.PASSED, false],
        [{ screenshot: ['afterStep'] }, Status.PASSED, true],
        [{ screenshot: { event: ['onFail'] } }, Status.FAILED, true],
        [{}, Status.FAILED, false],
    ])('after step %o %s', (driverConfig, status, expected) => {
        expect(saveScreenshotAfterStep({ driverConfig }, step(status))).toBe(expected);
    });

    test.each([
        [{ screenshot: 'beforeStep' }, true],
        [{ screenshot: { event: ['beforeStep', 'onFail'] } }, true],
        [{ screenshot: 'onFail' }, false],
    ])('before step %o', (driverConfig, expected) => {
        expect(saveScreenshotBeforeStep({ driverConfig })).toBe(expected);
    });
});

describe.each([
    ['trace', saveTrace],
    ['video', saveVideo],
])('%s', (key, fn) => {
    test.each([
        [['onFail'], Status.FAILED, true],
        [['onFail'], Status.PASSED, false],
        [['afterScenario'], Status.PASSED, true],
        ['afterScenario', Status.FAILED, true],
    ])('event %o %s', (event, status, expected) => {
        expect(fn({ [key]: { event } }, scenario(status))).toBe(expected);
    });

    test('not configured', () => {
        expect(fn({}, scenario(Status.FAILED))).toBeFalsy();
    });
});

test('traceArchive', () => {
    expect(traceArchive({ trace: { event: 'onFail' } }, scenario(Status.FAILED))).toMatch(/^traces[\\/]my-scenario---1-id\.zip$/);
    expect(traceArchive({ trace: { event: 'onFail', dir: 'out' } }, scenario(Status.FAILED))).toMatch(/^out[\\/]/);
});

test('parseCoords', () => {
    expect(parseCoords('1, 2.5')).toEqual([1, 2.5]);
    expect(parseCoordsAsObject('10,20')).toEqual({ x: 10, y: 20 });
});

test('equalOrIncludes', () => {
    expect(equalOrIncludes(['a', 'b'], 'b')).toBe(true);
    expect(equalOrIncludes('a', 'a')).toBe(true);
    expect(equalOrIncludes('a', 'b')).toBe(false);
});

test('dataTable2Array', async () => {
    const ctx: any = { getValue: async (v: string) => v.toUpperCase() };
    const dataTable: any = { raw: () => [['a'], ['b']] };
    expect(await dataTable2Array(ctx, dataTable)).toEqual(['A', 'B']);
});
