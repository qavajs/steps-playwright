import { po } from '@qavajs/po-playwright';
import memory from '@qavajs/memory';
import { Locator } from 'playwright';

export function getValue(alias: string): any {
    return memory.getValue(alias)
}

export async function getElement(alias: string): Promise<Locator> {
    return po.getElement(await memory.getValue(alias))
}
