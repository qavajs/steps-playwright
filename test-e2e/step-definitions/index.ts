import { Then } from '@cucumber/cucumber';
import memory from '@qavajs/memory';
import { Page } from 'playwright';
import { expect } from 'chai';

declare global {
    var page: Page;
}

Then('I expect {string} memory value to be equal {string}', async function(actual, expected) {
    const actualValue = memory.getValue(actual);
    const expectedValue = memory.getValue(expected);
    expect(expectedValue).to.eql(actualValue);
});

Then('I expect {string} memory value to contain {string}', async function(actual, expected) {
    const actualValue = memory.getValue(actual);
    const expectedValue = memory.getValue(expected);
    expect(actualValue).to.contain(expectedValue);
});

Then('I expect {string} memory value to have type {string}', async function(actual, expected) {
    const actualValue = memory.getValue(actual);
    const expectedValue = memory.getValue(expected);
    expect(actualValue).to.be.a(expectedValue);
});

Then('I expect viewport size to equal {string}', async function (expectedSize) {
    const expectedValue = await memory.getValue(expectedSize);
    const actualValue = page.viewportSize();
    expect(actualValue).to.deep.equal(expectedValue, 'Viewport size do not match');
})
