import { type Locator } from '@playwright/test';
import { type MemoryValue, type Validation, When } from '@qavajs/core';
import { type QavajsPlaywrightWorld } from './QavajsPlaywrightWorld';
import type { ConditionWait } from './conditionWait';

/**
 * Refresh page unless element matches condition
 * @param {string} alias - element to wait condition
 * @param {string} wait - wait condition
 * @param {number|null} [timeout] - custom timeout in ms
 * @example I refresh page until 'Internal Server Error Box' to be visible
 * @example I refresh page until 'Submit Button' to be enabled
 * @example I refresh page until 'Place Order Button' to be clickable (timeout: 3000)
 */
When(
    'I refresh page until {playwrightLocator} {playwrightCondition}( ){playwrightTimeout}',
    async function (this: QavajsPlaywrightWorld, locator: Locator, condition: ConditionWait, timeoutValue: number | null) {
        const timeout = timeoutValue ?? this.config.driverConfig.timeout.value;
        await this.playwright.expect(async () => {
            await this.playwright.page.reload()
            await condition(locator, this.config.driverConfig.timeout.pageRefreshInterval);
        }).toPass({timeout, intervals: [this.config.driverConfig.timeout.pageRefreshInterval]});
    }
);

/**
 * Refresh page unless element text matches condition
 * @param {string} alias - element to wait condition
 * @param {string} wait - wait condition
 * @param {string} value - expected value to wait
 * @param {number|null} [timeout] - custom timeout in ms
 * @example I refresh page until text of 'Order Status' to be equal 'Processing'
 * @example I refresh page until text of 'Currency' not contain '$'
 * @example I refresh page until text of 'My Salary' to match '/5\d{3,}/' (timeout: 3000)
 */
When(
    'I refresh page until text of {playwrightLocator} {validation} {value}( ){playwrightTimeout}',
    async function (this: QavajsPlaywrightWorld, locator: Locator, validation: Validation, expected: MemoryValue, timeoutValue?: number) {
        const expectedValue = await expected.value();
        await validation.poll(async () => {
            await this.playwright.page.reload();
            return await locator.innerText();
        }, expectedValue, {
            timeout: timeoutValue ?? this.config.driverConfig.timeout.value,
            interval: this.config.driverConfig.timeout.pageRefreshInterval
        });
    }
);

/**
 * Repeatedly click an element unless element text matches condition
 * @param {string} aliasToClick - element to wait condition
 * @param {string} aliasToCheck - element to wait condition
 * @param {string} wait - wait condition
 * @param {string} text - expected value to wait
 * @param {number|null} [timeout] - custom timeout in ms
 * @example I click 'Send Message Button' until text of 'Information Alert' to be equal 'Your account has been banned'
 * @example I click 'Add To Cart Button' until text of 'Shopping Cart Total' to match '/\$5\d{3,}/' (timeout: 3000)
 */
When(
    'I click {playwrightLocator} until text of {playwrightLocator} {validation} {value}( ){playwrightTimeout}',
    async function (this: QavajsPlaywrightWorld, 
        locatorToClick: Locator,
        locatorToCheck: Locator,
        validation: Validation,
        expected: MemoryValue,
        timeoutValue?: number,
    ) {
        const expectedText = await expected.value();
        await validation.poll(
            async () => {
                await locatorToClick.click();
                return locatorToCheck.innerText();
            },
            expectedText,
            {
                timeout: timeoutValue ?? this.config.driverConfig.timeout.value,
                interval: this.config.driverConfig.timeout.actionInterval
            },
        );
    },
);

/**
 * Repeatedly click an element unless element value attribute matches condition
 * @param {string} aliasToClick - element to wait condition
 * @param {string} aliasToCheck - element to wait condition
 * @param {string} wait - wait condition
 * @param {string} value - expected value to wait
 * @param {number|null} [timeout] - custom timeout in ms
 * @example I click 'Plus Button' until value of 'Quantity Input' to be equal '9'
 * @example I click 'Suggest Button' until value of 'Repository Name Input' to match '/\w{5,}/' (timeout: 30000)
 */
When(
    'I click {playwrightLocator} until value of {playwrightLocator} {validation} {value}( ){playwrightTimeout}',
    async function (this: QavajsPlaywrightWorld, 
        locatorToClick: Locator,
        locatorToCheck: Locator,
        validation: Validation,
        expected: MemoryValue,
        timeoutValue?: number,
    ) {
        const expectedValue = await expected.value();
        await validation.poll(
            async () => {
                await locatorToClick.click();
                return locatorToCheck.inputValue();
            },
            expectedValue,
            {
                timeout: timeoutValue ?? this.config.driverConfig.timeout.value,
                interval: this.config.driverConfig.timeout.actionInterval
            },
        );
    },
);

/**
 * Wait
 * @param {number} ms - milliseconds
 * @example I wait 1000 ms
 */
When('I wait {int} ms', async function (this: QavajsPlaywrightWorld, ms) {
    await new Promise((resolve: Function): void => {
        setTimeout(() => resolve(), ms)
    });
});

/**
 * Wait for absence of network activity during specified period of time
 * Fails if network is not idle within page timeout
 * @param {number} timeout - wait condition
 * @example I wait for network idle
 * @example I wait for network idle (timeout: 1000)
 */
When('I wait for network idle {playwrightTimeout}', async function (this: QavajsPlaywrightWorld, timeoutValue: number | null) {
    const idleTimeout = timeoutValue ?? this.config.driverConfig.timeout.networkIdle;
    const maxTimeout = Math.max(this.config.driverConfig.timeout.page, idleTimeout);
    const page = this.playwright.page;
    return new Promise<void>((resolve, reject) => {
        let idleTimerId = setTimeout(() => cleanup(resolve), idleTimeout);
        const maxTimerId = setTimeout(
            () => cleanup(() => reject(new Error(`Network was not idle for ${idleTimeout} ms within ${maxTimeout} ms`))),
            maxTimeout
        );

        const resetTimer = () => {
            clearTimeout(idleTimerId);
            idleTimerId = setTimeout(() => cleanup(resolve), idleTimeout);
        };

        const cleanup = (done: () => void) => {
            clearTimeout(idleTimerId);
            clearTimeout(maxTimerId);
            page.removeListener('request', resetTimer);
            page.removeListener('requestfinished', resetTimer);
            page.removeListener('requestfailed', resetTimer);
            done();
        };

        page.on('request', resetTimer);
        page.on('requestfinished', resetTimer);
        page.on('requestfailed', resetTimer);
    });
});
