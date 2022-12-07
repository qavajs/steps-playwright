import { resolve } from 'path';
const file = (path: string) => `file://${path}`
export default class Memory {
    valuesPage = file(resolve('./test-e2e/apps/values.html'));
    actionsPage = file(resolve('./test-e2e/apps/actions.html'));
    framePage = file(resolve('./test-e2e/apps/frame.html'));
    waitsPage = file(resolve('./test-e2e/apps/waits.html'));

    array = (...args: Array<any>) => args;

    // @ts-ignore
    setInputValue = () => document.querySelector('#input').value = 'some value';

    // @ts-ignore
    getActionInnerText = () => document.querySelector("#action").innerText;

    // @ts-ignore
    clickJS = target => target.click();

    // @ts-ignore
    getInnerText = target => target.innerText;
}

