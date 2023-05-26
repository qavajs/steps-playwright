import { Locator } from 'playwright';
import { expect } from '@playwright/test';
import { throwTimeoutError } from './utils/utils';

export const conditionValidations = {
    PRESENT: 'present',
    // CLICKABLE: 'clickable',
    VISIBLE: 'visible',
    INVISIBLE: 'invisible',
    IN_VIEWPORT: 'in viewport',
    ENABLED: 'enabled',
    DISABLED: 'disabled'
}

const notClause = '(not )?';
const toBeClause = 'to (?:be )?';
const validationClause = `(${Object.values(conditionValidations).join('|')})`;

export const conditionWaitExtractRegexp = new RegExp(`^${notClause}${toBeClause}${validationClause}$`);
export const conditionWaitRegexp = new RegExp(`(${notClause}${toBeClause}${validationClause})`);

const waits = {
    [conditionValidations.PRESENT]: (
        element: Locator,
        reverse: boolean,
        timeout: number,
        timeoutMsg: string
    ) => element.waitFor({state: reverse ? 'detached' : 'attached', timeout}),
    [conditionValidations.VISIBLE]: (
        element: Locator,
        reverse: boolean,
        timeout: number,
        timeoutMsg: string
    ) => element.waitFor({state: reverse ? 'hidden' : 'visible', timeout}),
    [conditionValidations.INVISIBLE]: (
        element: Locator,
        reverse: boolean,
        timeout: number,
        timeoutMsg: string
    ) => element.waitFor({state: reverse ? 'visible' : 'hidden', timeout}),
    [conditionValidations.IN_VIEWPORT]: (
        element: Locator,
        reverse: boolean,
        timeout: number,
        timeoutMsg: string
    ) => throwTimeoutError(() => expect(async () => {
        const e = reverse ? expect(element).not : expect(element);
        await e.toBeInViewport();
    }).toPass({ timeout }), timeoutMsg),
    [conditionValidations.ENABLED]: (
        element: Locator,
        reverse: boolean,
        timeout: number,
        timeoutMsg: string
    ) => throwTimeoutError(() => expect(async () => {
        const e = reverse ? expect(element).not : expect(element);
        await e.toBeEnabled();
    }).toPass({ timeout }), timeoutMsg),
    [conditionValidations.DISABLED]: (
        element: Locator,
        reverse: boolean,
        timeout: number,
        timeoutMsg: string
    ) => throwTimeoutError(() => expect(async () => {
        const e = reverse ? expect(element).not : expect(element);
        await e.toBeDisabled();
    }).toPass({ timeout }), timeoutMsg)
}
/**
 * Wait for condition
 * @param {Locator} element - element
 * @param {string} validationType - validation to perform
 * @param {number} [timeout] - timeout to wait
 * @param {boolean} [reverse] - negate flag
 * @return {Promise<void>}
 */
export async function conditionWait(
    element: Locator,
    validationType: string,
    timeout: number = 10000,
    reverse: boolean = false
) {
    const timeoutMsg: string = `Element is${reverse ? '' : ' not'} ${validationType}`;
    const waitFn = waits[validationType];
    await waitFn(element, reverse, timeout, timeoutMsg);
}
