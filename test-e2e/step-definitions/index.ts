import { Then } from '@cucumber/cucumber';
import memory from '@qavajs/memory';
import { Page, expect } from '@playwright/test';
import {getElement} from "../../src/transformers";
import {getValidation} from "@qavajs/validation";

declare global {
    var page: Page;
}

Then('I expect {string} memory value to be equal {string}', async function (actual, expected) {
    const actualValue = memory.getValue(actual);
    const expectedValue = memory.getValue(expected);
    expect(expectedValue).toEqual(actualValue);
});

Then('I expect {string} memory value to contain {string}', async function (actual, expected) {
    const actualValue = memory.getValue(actual);
    const expectedValue = memory.getValue(expected);
    expect(actualValue).toContain(expectedValue);
});

Then('I expect {string} memory value to have type {string}', async function (actual, expected) {
    const actualValue = memory.getValue(actual);
    const expectedValue = memory.getValue(expected);
    expect(typeof actualValue === expectedValue).toBeTruthy();
});

Then('I expect viewport size to equal {string}', async function (expectedSize) {
    const expectedValue = await memory.getValue(expectedSize);
    const actualValue = page.viewportSize();
    expect(actualValue).toEqual(expectedValue);
})

Then('I set {int} ms delayed mock for {string} request', async function (delay: number, glob: string) {
    await page.route(glob, async (route) => {
        setTimeout(async () => await route.fulfill({
          status: 200,
          contentType: 'text/plain',
          body: 'Everything is okay'
        }), delay);
    });
})
