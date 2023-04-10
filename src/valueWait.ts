import { expect } from '@playwright/test';

function toSimpleEqual(this: any, actual: any, expected: any) {
    const pass = actual == expected;
    if (pass) {
        return {
            message: () =>
                `expected ${this.utils.printReceived(
                    actual,
                )} not to be equal ${this.utils.printExpected(
                    expected,
                )}`,
            pass: true,
        };
    } else {
        return {
            message: () =>
                `expected ${this.utils.printReceived(
                    actual,
                )} to be equal ${this.utils.printExpected(
                    expected,
                )}`,
            pass: false,
        };
    }
}

expect.extend({ toSimpleEqual });

function regexp(regexpLike: string | RegExp) {
    if (typeof regexpLike === 'string') {
        return new RegExp(regexpLike, 'gmi')
    }
    return regexpLike
}

export const valueValidations = {
    EQUAL: 'equal',
    CONTAIN: 'contain',
    ABOVE: 'above',
    BELOW: 'below',
    MATCH: 'match'
}

const notClause = '(not )?';
const toBeClause = 'to (?:be )?';
const validationClause = `(${Object.values(valueValidations).join('|')})`;

export const valueWaitExtractRegexp = new RegExp(`^${notClause}${toBeClause}${validationClause}$`);
export const valueWaitRegexp = new RegExp(`(${notClause}${toBeClause}${validationClause})`);

const waits = {
    [valueValidations.EQUAL]: async (poll: any, expected: any) => poll.toSimpleEqual(expected),
    [valueValidations.CONTAIN]: async (poll: any, expected: any) => poll.toContain(expected),
    [valueValidations.ABOVE]: async (poll: any, expected: any) => poll.toBeGreaterThan(parseInt(expected)),
    [valueValidations.BELOW]: async (poll: any, expected: any) => poll.toBeLessThan(parseInt(expected)),
    [valueValidations.MATCH]: async (poll: any, expected: any) => poll.toMatch(regexp(expected))
}

/**
 * Wait for condition
 * @param {any} valueFn - function to return value
 * @param {any} expected - expected value
 * @param {string} validationType - validation to perform
 * @param {number} [timeout] - timeout to wait
 * @param {boolean} [reverse] - negate flag
 * @return {Promise<void>}
 */
export async function valueWait(
    valueFn: Function,
    expected: any,
    validationType: string,
    timeout: number = 10000,
    reverse: boolean
) {
    const message: string = `Value is${reverse ? '' : ' not'} ${validationType} ${expected}`;
    const options = { timeout, message };
    const waitFn = waits[validationType];
    const poll = reverse
        ? expect.poll(() => valueFn(), options).not
        : expect.poll(() => valueFn(), options);
    await waitFn(poll, expected);
}
