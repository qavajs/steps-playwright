import { selectors } from '@playwright/test';

export async function createJSEngine() {
    const jsEngine = () => ({
        query(root: any, selector: string) {
            return eval(selector);
        },
        queryAll(root: any, selector: string) {
            return eval(selector);
        },
    });
    await selectors.register('js', jsEngine);
}
