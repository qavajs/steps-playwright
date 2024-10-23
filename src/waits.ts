import {When} from '@cucumber/cucumber';
import {Locator} from "@playwright/test";
import {MemoryValue, Validation} from "@qavajs/cli";

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
    async function (locator: Locator, condition: any, timeoutValue: number | null) {
        const timeout = timeoutValue ?? this.config.browser.timeout.value;
        await this.playwright.expect(async () => {
            await this.playwright.page.reload()
            await condition(locator, this.config.browser.timeout.pageRefreshInterval);
        }).toPass({timeout, intervals: [this.config.browser.timeout.pageRefreshInterval]});
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
    async function (locator: Locator, validation: Validation, expected: MemoryValue, timeoutValue?: number) {
        const expectedValue = await expected.value();
        await validation.poll(async () => {
            await this.playwright.page.reload();
            return await locator.innerText();
        }, expectedValue, {
            timeout: timeoutValue ?? this.config.browser.timeout.value,
            interval: this.config.browser.timeout.pageRefreshInterval
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
    async function (
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
                timeout: timeoutValue ?? this.config.browser.timeout.value,
                interval: this.config.browser.timeout.actionInterval
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
    async function (
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
                timeout: timeoutValue ?? this.config.browser.timeout.value,
                interval: this.config.browser.timeout.actionInterval
            },
        );
    },
);

/**
 * Wait
 * @param {number} ms - milliseconds
 * @example I wait 1000 ms
 */
When('I wait {int} ms', async function (ms) {
    await new Promise((resolve: Function): void => {
        setTimeout(() => resolve(), ms)
    });
});

/**
 * Wait for absence of network activity during specified period of time
 * @param {number} timeout - wait condition
 * @example I wait for network idle for 1000 ms
 */
When('I wait for network idle {playwrightTimeout}', async function (timeoutValue: number | null) {
    const timeout = timeoutValue ?? this.config.browser.timeout.networkIdle ?? 500
    return new Promise((resolve) => {
        let timerId: any = setTimeout(() => {
            cleanupAndResolve();
        }, timeout);

        const resetTimer = () => {
            clearTimeout(timerId);
            timerId = setTimeout(() => {
                cleanupAndResolve();
            }, timeout);
        };

        this.playwright.page.on('request', resetTimer);
        this.playwright.page.on('requestfinished', resetTimer);
        this.playwright.page.on('requestfailed', resetTimer);

        const cleanupAndResolve = () => {
            this.playwright.page.removeListener('request', resetTimer);
            this.playwright.page.removeListener('requestfinished', resetTimer);
            this.playwright.page.removeListener('requestfailed', resetTimer);
            resolve(0);
        };
    });
})
