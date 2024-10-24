import { Then } from '@cucumber/cucumber';
import { expect, Route } from '@playwright/test';
import { existsSync } from 'node:fs';
import { type MemoryValue, type Validation } from '@qavajs/core';

Then('I expect {value} memory value {validation} {value}', async function (actual: MemoryValue, validation: Validation, expected: MemoryValue) {
    validation(
        await actual.value(),
        await expected.value()
    );
});

Then('I expect viewport size to equal {value}', async function (expectedSize: MemoryValue) {
    const actualValue = this.playwright.page.viewportSize();
    expect(actualValue).toEqual(await expectedSize.value());
})

Then('I set {int} ms delayed mock for {string} request', async function (delay: number, glob: string) {
    await this.playwright.page.route(glob, async (route: Route) => {
        setTimeout(async () => await route.fulfill({
          status: 200,
          contentType: 'text/plain',
          body: 'Everything is okay'
        }), delay);
    });
})

Then('I expect file {value} to exist', async function (path: MemoryValue){
    const filePresence = existsSync(await path.value());
    expect(filePresence).toBeTruthy();
});
