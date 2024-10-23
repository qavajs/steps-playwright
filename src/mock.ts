import { When } from '@cucumber/cucumber';
import { Route } from '@playwright/test';
import {MemoryValue} from "@qavajs/cli";

/**
 * Create simple mock instance
 * @param {string} urlTemplate - minimatch url template to mock
 * @param {string} memoryKey - memory key to store mock instance
 * @example When I create mock for '/yourservice/**' as 'mock1'
 * @example When I create mock for '$mockUrlTemplate' as 'mock1'
 */
When('I create mock for {value} as {value}', async function (urlTemplate: MemoryValue, memoryKey: MemoryValue) {
    const url = await urlTemplate.value();
    memoryKey.set(url);
});

async function respondWith(this: any, mockKey: MemoryValue, statusCode: MemoryValue, body: string): Promise<void> {
    const mockUrl: string = await mockKey.value();
    const responseStatusCode: number = parseInt(await statusCode.value());
    const responseBody = await this.getValue(body);
    await this.playwright.page.route(mockUrl, async (route: Route) => {
        await route.fulfill({
            body: responseBody,
            status: responseStatusCode
        });
    });
}

/**
 * Add mocking rule to respond with desired status code and payload
 * @param {string} mockKey - memory key to get mock instance
 * @param {string} statusCode - status code
 * @param {string} body - response body
 * @example
 * When I create mock for '/yourservice/**' as 'myServiceMock'
 * And I set '$myServiceMock' mock to respond '200' with:
 * """
 * {
 *     "status": "success"
 * }
 * """
 */
When('I set {value} mock to respond {value} with:', respondWith);

/**
 * Add mocking rule to respond with desired status code and payload
 * @param {string} mockKey - memory key to get mock instance
 * @param {string} statusCode - status code
 * @param {string} body - response body
 * @example
 * When I create mock for '/yourservice/**' as 'myServiceMock'
 * And I set '$myServiceMock' mock to respond '200' with '$response'
 */
When('I set {value} mock to respond {value} with {string}', respondWith);

/**
 * Add mocking rule to abort request with certain reason
 * @param {string} mockKey - memory key to get mock instance
 * @param {string} reason - reason string see https://playwright.dev/docs/api/class-route#route-abort
 * @example
 * When I create mock for '/yourservice/**' as 'myServiceMock'
 * And I set '$myServiceMock' mock to abort with 'Failed' reason
 */
When('I set {value} mock to abort with {value} reason', async function (mockKey: MemoryValue, reason: MemoryValue) {
    const mockUrl: string = await mockKey.value();
    const errorCode: string = await reason.value();
    await this.playwright.page.route(mockUrl, async (route: Route) => {
        await route.abort(errorCode);
    });
});

/**
 * Restore mock
 * @param {string} mockKey - memory key to get mock instance
 * @example When I restore '$myServiceMock'
 */
When('I restore {value} mock', async function (mockKey: MemoryValue) {
    const mockUrl: string = await mockKey.value();
    await this.playwright.page.unroute(mockUrl);
});

/**
 * Restore all mocks
 * @example When I restore all mocks
 */
When('I restore all mocks', async function () {
   this.playwright.page._routes = [];
});
