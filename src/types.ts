import { defineParameterType } from '@cucumber/cucumber';

defineParameterType({
    name: 'playwrightValidation',
    regexp: /((?:is |do |does |to )?(not |to not )?(?:to )?(?:be )?(equal|strictly equal|deeply equal|have member|match|contain|above|below|greater than|less than|have type)(?:s|es)?)/,
    transformer: p => p,
    useForSnippets: false
});

defineParameterType({
    name: 'playwrightValueWait',
    regexp: /((not )?to (?:be )?(equal|contain|above|below))/,
    transformer: p => p,
    useForSnippets: false
});

defineParameterType({
    name: 'playwrightConditionWait',
    regexp: /((not )?to (?:be )?(present|clickable|visible|invisible|enabled|disabled))/,
    transformer: p => p,
    useForSnippets: false
});
