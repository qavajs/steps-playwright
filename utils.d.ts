import { Locator } from '@playwright/test';
export function getElement(alias: string): Promise<Locator>;
export function getValue(alias: string): any;
export function getConditionWait(condition: string): (element: Locator, timeout: number) => Promise<void>

