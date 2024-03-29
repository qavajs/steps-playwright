const {test} = require('@playwright/test');
const {po} = require('@qavajs/po-playwright');
const memory = require('@qavajs/memory');
const {loadStepDefinitions} = require('../lib/ui_connector/stepDefProvider');
const {loadFeatures} = require('../lib/ui_connector/featureProvider');

const config = require(process.env.CONFIG ?? 'config.js');
const profile = process.env.PROFILE ?? 'default';
const resolvedConfig = config[profile];
const features = loadFeatures(resolvedConfig.paths);
const supportCodeLibrary = loadStepDefinitions(resolvedConfig.require);

global.config = resolvedConfig;

for (const feature of features) {
    const tests = feature.tests;
    test.describe(feature.feature, async () => {
        test.beforeAll(async () => {
            for (const beforeAllHook of supportCodeLibrary.beforeTestRunHookDefinitions) {
                await beforeAllHook.code.apply({});
            }
        });
        for (const testCase of tests) {
            const tag = testCase.tags.map(tag => tag.name);
            test(testCase.name, {tag}, async ({page, context, browser}) => {
                const world = {
                    log(data) {
                        console.log(data);
                    },
                    attach(data, details) {
                        const fileName = details.fileName ?? 'attachment';
                        const contentType = details.mediaType ?? 'text/plain';
                        test.info().attach(fileName, {contentType})
                    }
                };
                await test.step('qavajs init', async () => {
                    global.page = page;
                    global.context = context;
                    global.browser = browser;
                    memory.register(resolvedConfig.memory);
                    po.init(page, {timeout: test.info().timeout});
                    po.register(resolvedConfig.pageObject);
                });

                for (const beforeHook of supportCodeLibrary.beforeTestCaseHookDefinitions) {
                    if (beforeHook.appliesToTestCase(testCase)) {
                        await test.step('Before', async () => {
                            await beforeHook.code.apply(world, testCase);
                        })
                    }
                }
                for (const pickleStep of testCase.steps) {
                    await test.step(pickleStep.text, async () => {
                        for (const beforeStep of supportCodeLibrary.beforeTestStepHookDefinitions) {
                            if (beforeStep.appliesToTestCase(testCase)) {
                                await beforeStep.code.apply(world);
                            }
                        }
                        const steps = supportCodeLibrary.stepDefinitions
                            .filter(stepDefinition => stepDefinition.matchesStepName(pickleStep.text));
                        if (steps.length === 0) throw new Error(`Step '${pickleStep.text}' is not defined`);
                        if (steps.length > 1) throw new Error(`'${pickleStep.text}' matches multiple step definitions`);
                        const [step] = steps;
                        const {parameters} = await step.getInvocationParameters({
                            step: {
                                text: pickleStep.text,
                                argument: pickleStep.argument
                            },
                            world
                        });
                        const result = {status: 'passed'};
                        try {
                            await step.code.apply(world, parameters);
                        } catch (err) {
                            result.status = 'failed';
                            result.error = err;
                        }
                        for (const afterStep of supportCodeLibrary.afterTestStepHookDefinitions) {
                            if (afterStep.appliesToTestCase(testCase)) {
                                await afterStep.code.apply(world, result);
                            }
                        }
                        if (result.error) throw result.error;
                    });
                }
                for (const afterHook of supportCodeLibrary.afterTestCaseHookDefinitions) {
                    if (afterHook.appliesToTestCase(testCase)) {
                        await test.step('After', async () => {
                            await afterHook.code.apply(world, testCase);
                        })
                    }
                }
            })
        }
        test.afterAll(async function() {
            for (const afterAllHook of supportCodeLibrary.afterTestRunHookDefinitions) {
                await afterAllHook.code.apply({});
            }
        })
    });
}


