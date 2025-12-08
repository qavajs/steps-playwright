import { type Locator, expect } from '@playwright/test';

class SoftAssertionError extends Error {
    name = 'SoftAssertionError';
}

export const conditionValidations = {
    PRESENT: 'present',
    CLICKABLE: 'clickable',
    VISIBLE: 'visible',
    INVISIBLE: 'invisible',
    IN_VIEWPORT: 'in viewport',
    FULLY_IN_VIEWPORT: 'fully in viewport',
    ENABLED: 'enabled',
    DISABLED: 'disabled'
}

const notClause = '(not )?';
const toBeClause = 'to (?:be )?';
const softClause = '(softly )?'
const validationClause = `(${Object.values(conditionValidations).join('|')})`;

export const conditionWaitExtractRegexp = new RegExp(`^${notClause}${toBeClause}${softClause}${validationClause}$`);

const makeExpect = (element: Locator, reverse: boolean, message: string) => {
    const eMessage = expect(element, message);
    return reverse ? eMessage.not : eMessage;
}
const waits = {
    [conditionValidations.PRESENT]: (
        element: Locator,
        reverse: boolean,
        timeout: number,
        timeoutMsg: string
    ) => makeExpect(element, reverse, timeoutMsg).toBeAttached({ timeout }),
    [conditionValidations.VISIBLE]: (
        element: Locator,
        reverse: boolean,
        timeout: number,
        timeoutMsg: string
    ) => makeExpect(element, reverse, timeoutMsg).toBeVisible({ timeout }),
    [conditionValidations.INVISIBLE]: (
        element: Locator,
        reverse: boolean,
        timeout: number,
        timeoutMsg: string
    ) => makeExpect(element, reverse, timeoutMsg).toBeHidden({ timeout }),
    [conditionValidations.IN_VIEWPORT]: (
        element: Locator,
        reverse: boolean,
        timeout: number,
        timeoutMsg: string
    ) => makeExpect(element, reverse, timeoutMsg).toBeInViewport({ timeout }),
    [conditionValidations.FULLY_IN_VIEWPORT]: (
        element: Locator,
        reverse: boolean,
        timeout: number,
        timeoutMsg: string
    ) => makeExpect(element, reverse, timeoutMsg).toBeInViewport({ ratio: 1, timeout }),
    [conditionValidations.ENABLED]: (
        element: Locator,
        reverse: boolean,
        timeout: number,
        timeoutMsg: string
    ) => makeExpect(element, reverse, timeoutMsg).toBeEnabled({ timeout }),
    [conditionValidations.DISABLED]: (
        element: Locator,
        reverse: boolean,
        timeout: number,
        timeoutMsg: string
    ) => makeExpect(element, reverse, timeoutMsg).toBeDisabled({ timeout }),
    [conditionValidations.CLICKABLE]: (
        element: Locator,
        reverse: boolean,
        timeout: number,
        timeoutMsg: string
    ) => makeExpect(element, reverse, timeoutMsg).toBeEnabled({ timeout }),
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
): Promise<void> {
    const timeoutMsg: string = `Element is${reverse ? '' : ' not'} ${validationType}`;
    const waitFn = waits[validationType];
    await waitFn(element, reverse, timeout, timeoutMsg);
}

export function getConditionWait(condition: string): Function {
    const match = condition.match(conditionWaitExtractRegexp) as RegExpMatchArray;
    if (!match) throw new Error(`${condition} condition is not implemented`);
    const [_, reverse, soft, validation] = match;
    return async function (element: Locator, timeout: number) {
        try {
            await conditionWait(element, validation, timeout, Boolean(reverse))
        } catch (error) {
            if (soft && error instanceof Error) throw new SoftAssertionError(error.message, { cause: error });
            throw error;
        }
    }
}