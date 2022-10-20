import { Then, When } from '@cucumber/cucumber';
import memory from '@qavajs/memory';
import { Browser, BrowserContext, Page } from 'playwright';
import { expect } from 'chai';

declare global {
    var browser: Browser;
    var driver: Browser;
    var context: BrowserContext;
    var page: Page;
    var config: any;
}

Then('I expect {string} memory value to be equal {string}', async function(actual, expected) {
    const actualValue = memory.getValue(actual);
    const expectedValue = memory.getValue(expected);
    expect(expectedValue).to.eql(actualValue);
});
