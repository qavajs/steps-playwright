import { getValue, getConditionWait, getElement } from '../utils.js'
import { test, expect } from 'vitest';
test.each([
    getValue,
    getConditionWait,
    getElement
])('util function %o', (fn) => {
    expect(fn).toBeInstanceOf(Function);
});
