import { expect, Route } from '@playwright/test';
import { existsSync } from 'node:fs';
import { Then, type MemoryValue, type Validation } from '@qavajs/core';
import { QavajsPlaywrightWorld } from '../../index';

Then('I expect {value} memory value {validation} {value}', async function (this: QavajsPlaywrightWorld, actual: MemoryValue, validation: Validation, expected: MemoryValue) {
    validation(
        await actual.value(),
        await expected.value()
    );
});

Then('I expect viewport size to equal {value}', async function (this: QavajsPlaywrightWorld, expectedSize: MemoryValue) {
    const actualValue = this.playwright.page.viewportSize();
    expect(actualValue).toEqual(await expectedSize.value());
})

Then('I set {int} ms delayed mock for {string} request', async function (this: QavajsPlaywrightWorld, delay: number, glob: string) {
    await this.playwright.page.route(glob, async (route: Route) => {
        setTimeout(async () => await route.fulfill({
          status: 200,
          contentType: 'text/plain',
          body: 'Everything is okay'
        }), delay);
    });
})

Then('I expect file {value} to exist', async function (this: QavajsPlaywrightWorld, path: MemoryValue){
    const filePresence = existsSync(await path.value());
    expect(filePresence).toBeTruthy();
});

Then(
    'I save {value} to memory as {value}',
    async function (value: MemoryValue, key: MemoryValue) {
        key.set(await value.value());
    }
);