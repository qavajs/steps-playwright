import { locator } from '../po'
import { test, expect } from 'vitest';
test.each([
    locator,
    locator.template,
    locator.native
])('po function %o', (fn) => {
    expect(fn).toBeInstanceOf(Function);
});
