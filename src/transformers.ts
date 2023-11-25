import { conditionWait, conditionWaitExtractRegexp } from './conditionWait';
import { po } from '@qavajs/po-playwright';
import memory from '@qavajs/memory';
import { Locator } from 'playwright';

export function getValue(alias: string): any {
    return memory.getValue(alias)
}

export async function getElement(alias: string): Promise<Locator> {
    return po.getElement(await memory.getValue(alias))
}

export function getConditionWait(condition: string): Function {
    const match = condition.match(conditionWaitExtractRegexp) as RegExpMatchArray;
    if (!match) throw new Error(`${condition} wait is not implemented`);
    const [ _, reverse, validation ] = match;
    return async function (element: Locator, timeout: number) {
        await conditionWait(element, validation, timeout, Boolean(reverse))
    }
}
