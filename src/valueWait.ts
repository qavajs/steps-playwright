import { expect } from '@playwright/test';
export const valueValidations = {
    EQUAL: 'equal',
    CONTAIN: 'contain',
    ABOVE: 'above',
    BELOW: 'below'
}

const notClause = '(not )?';
const toBeClause = 'to (?:be )?';
const validationClause = `(${Object.values(valueValidations).join('|')})`;

export const valueWaitExtractRegexp = new RegExp(`^${notClause}${toBeClause}${validationClause}$`);
export const valueWaitRegexp = new RegExp(`(${notClause}${toBeClause}${validationClause})`);

const waits = {
    [valueValidations.EQUAL]: async (poll: any, expected: any) => poll.toBe(expected),
    [valueValidations.CONTAIN]: async (poll: any, expected: any) => poll.toContain(expected),
    [valueValidations.ABOVE]: async (poll: any, expected: any) => poll.toBeGreaterThan(expected),
    [valueValidations.BELOW]: async (poll: any, expected: any) => poll.toBeLessThan(expected)
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
