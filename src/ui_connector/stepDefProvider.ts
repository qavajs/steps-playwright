import { supportCodeLibraryBuilder } from '@cucumber/cucumber';
import { IdGenerator } from '@cucumber/messages';
import { globSync } from 'glob';
import {resolve} from 'node:path';

export function loadStepDefinitions(globPattern: string[]) {
    supportCodeLibraryBuilder.reset(process.cwd(), IdGenerator.uuid());
    const files = globSync(globPattern);
    for (const file of files) {
        const filePath = resolve(file);
        require(filePath);
    }
    return supportCodeLibraryBuilder.finalize();
}
