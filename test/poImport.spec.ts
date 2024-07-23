import { po, $, $$, Component, Selector, NativeSelector } from '../po'
import { test, expect } from 'vitest';
test.each([
    po.init,
    po.register,
    po.setDriver,
    po.getElement,
    $,
    $$,
    Component,
    Selector,
    NativeSelector
])('po function %o', (fn) => {
    expect(fn).toBeInstanceOf(Function);
});
