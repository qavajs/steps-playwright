import { describe, test, expect } from 'vitest';
import { conditionWaitExtractRegexp, getConditionWait, conditionWait, conditionValidations } from '../src/conditionWait';

describe('condition regexp', () => {
    test.each([
        ['to be visible', [undefined, undefined, 'visible']],
        ['not to be present', ['not ', undefined, 'present']],
        ['to be softly clickable', [undefined, 'softly ', 'clickable']],
        ['not to be fully in viewport', ['not ', undefined, 'fully in viewport']],
        ['to disabled', [undefined, undefined, 'disabled']],
    ])('%s', (condition, expected) => {
        const [, ...groups] = condition.match(conditionWaitExtractRegexp) as RegExpMatchArray;
        expect(groups).toEqual(expected);
    });

    test('covers every validation', () => {
        for (const validation of Object.values(conditionValidations)) {
            expect(`to be ${validation}`).toMatch(conditionWaitExtractRegexp);
        }
    });
});

test('unknown condition', () => {
    expect(() => getConditionWait('to be shiny')).toThrow('to be shiny condition is not implemented');
});

test('unknown validation type', async () => {
    await expect(conditionWait({} as any, 'shiny', 10)).rejects.toThrow('shiny condition is not implemented');
});

describe('clickable', () => {
    const element = (visible: boolean, enabled: boolean): any => ({
        isVisible: async () => visible,
        isEnabled: async () => enabled
    });

    test.each([
        [true, true, 'to be clickable', true],
        [false, true, 'to be clickable', false],
        [true, false, 'to be clickable', false],
        [true, false, 'not to be clickable', true],
        [true, true, 'not to be clickable', false],
    ])('visible: %s, enabled: %s, %s', async (visible, enabled, condition, passes) => {
        const wait = getConditionWait(condition);
        const result = wait(element(visible, enabled), 300);
        passes
            ? await expect(result).resolves.toBeUndefined()
            : await expect(result).rejects.toThrow(/Element is/);
    });

    test('soft clickable throws SoftAssertionError', async () => {
        const wait = getConditionWait('to be softly clickable');
        await expect(wait(element(false, true), 300)).rejects.toMatchObject({ name: 'SoftAssertionError' });
    });
});
