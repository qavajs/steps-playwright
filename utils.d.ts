import { Locator } from 'playwright';
export function getElement(alias: string): Promise<Locator>;
export function getValue(alias: string): any;
export function getConditionWait(condition: string): (element: Locator) => Promise;

