import { defineParameterType } from '@qavajs/core';
import { getConditionWait } from './conditionWait';

function transformString(fn: (value: string) => any) {
    return function (s1: string, s2: string) {
        const expression = (s1 || s2 || '').replace(/\\"/g, '"').replace(/\\'/g, "'")
        return fn(expression);
    }
}

defineParameterType({
    name: 'playwrightLocator',
    regexp: /"([^"\\]*(\\.[^"\\]*)*)"|'([^'\\]*(\\.[^'\\]*)*)'/,
    transformer: function (s1: string, s2: string) {
        const world = this as any;
        return transformString(function (alias) {
            return world.element(world.getValue(alias));
        })(s1, s2);
    }
});

defineParameterType({
    name: 'playwrightCondition',
    regexp: /((not )?to (?:be )?(?:softly )?(present|clickable|visible|invisible|enabled|disabled|in viewport|fully in viewport))/,
    transformer: getConditionWait,
    useForSnippets: false
});

defineParameterType({
    name: 'playwrightTimeout',
    regexp: /(?:\(timeout: (\d+)\))?/,
    transformer: p => p ? parseInt(p) : null,
    useForSnippets: false
});

defineParameterType({
    name: 'playwrightMouseButton',
    regexp: /(left|right|middle)/,
    transformer: p => p,
    useForSnippets: false
});

defineParameterType({
    name: 'playwrightBrowserButton',
    regexp: /(back|forward)/,
    transformer: p => p,
    useForSnippets: false
});
