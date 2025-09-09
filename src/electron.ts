import { type MemoryValue, When } from '@qavajs/core';

/**
 * Execute client function on electron process and save result into memory
 * @param {string} functionKey - memory key of function
 * @param {string} memoryKey - memory key to store result
 * @example I execute '$fn' function and save result as 'result' // fn is function reference
 * @example I execute '$js(async ({ app }) => app.getAppPath())' function and save result as 'scroll'
 */
When('I execute {value} function/script on electron app', async function (fn: MemoryValue) {
    await this.playwright.driver.evaluate(await fn.value());
});

/**
 * Execute client function on electron process and save result into memory
 * @param {string} functionKey - memory key of function
 * @param {string} memoryKey - memory key to store result
 * @example I execute '$fn' function and save result as 'result' // fn is function reference
 * @example I execute '$js(async ({ app }) => app.getAppPath())' function on electron app and save result as 'result'
 */
When('I execute {value} function/script on electron app and save result as {value}', async function (fn: MemoryValue, memoryKey: MemoryValue) {
    memoryKey.set(await this.playwright.driver.evaluate(await fn.value()));
});

/**
 * Click electron menu
 * @param {string} menuPath - menu path
 * @example I click 'File > Edit' electron menu
 */
When('I click {value} electron menu', async function (menu: MemoryValue) {
    await this.playwright.driver.evaluate(async ({ Menu }: { Menu: any }, { menuPath }: { menuPath: string }) => {
        const path = menuPath.split(/\s*>\s*/) as string[];
        const menu = Menu.getApplicationMenu();
        if (!menu) throw new Error('Menu is not set');
        const firstMenu = path.shift() as string;
        const findItemPredicate = (item: string) => (menu: any) => menu.label === item || menu.role === item;
        let currentMenu = menu.items.find(findItemPredicate(firstMenu));
        if (!currentMenu) throw new Error(`Menu '${firstMenu}' is not found`);
        for (const pathItem of path) {
            if (!currentMenu?.submenu) throw new Error(`Menu '${pathItem}' does not have submenu`);
            currentMenu = currentMenu.submenu.items.find(findItemPredicate(pathItem));
            if (!currentMenu) throw new Error(`Menu '${pathItem}' is not found`);
        }
        currentMenu.click()
    }, { menuPath: await menu.value() });
});