import { When } from '@cucumber/cucumber';
import { MemoryValue } from '@qavajs/cli';
import { locator } from './pageObject';

/**
 * Register selector as page object
 * @param {string} selectorKey - selector to register
 * @param {string} aliasKey - alias of element
 * @example
 * When I define '#someId' as 'My Button' locator
 * And I click 'My Button'
 */
When('I define {value} as {value} locator', async function (selectorKey: MemoryValue, aliasKey: MemoryValue) {
    const selector = await selectorKey.value();
    const alias = (await aliasKey.value()).replace(/\s/g, '');
    this.config.pageObject.prototype[alias] = locator(selector);
});

