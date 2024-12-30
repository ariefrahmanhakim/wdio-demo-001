import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect, $ } from '@wdio/globals'

import mapperWeb from '../mappers/mapperWeb';
import helperBrowser from '../helperWeb/helperBrowser';

Given(/^User go to (.*) apps$/,
    async (page) => {
        try {
            const url = await mapperWeb.getProperties(page);
            await helperBrowser.openUrl(url);
        } catch (error) {
            console.error(`Error navigating to page: ${error.message}`);
            throw error;
        }
    });

When(/^(.*) User fill (.*) with (data|properties|staticData) (.*)$/,
    async (path: string, locator: string, type: string, data: string) => {
        const theData: string = await helperBrowser.getDataSource(path, type, data);
        let element: string[] = mapperWeb.getElement(path, locator);

        const inputField = await $(element[0]);
        await inputField.setValue(theData);
    });

When(/^(.*) User click (.*)$/, async (path: string, locator: string) => {
    let element: string[] = mapperWeb.getElement(path, locator);

    const clickField = await $(element[0]);
    await clickField.click();
});

Then(
    /^(.*) Verify (text|contains text) (data|translation) (.*) will (be|not) displayed$/,
    async (path: string, typeText: string, type: string, data: string, typeVerify: string) => {
        let selector: string;
        let theData: string | undefined;

        theData = await helperBrowser.getDataSource(path, type, data);

        if (typeText === 'text') {
            selector = `//*[text()='${theData}' or text()='${theData}']`;
        } else if (typeText === 'contains text') {
            selector = `//*[contains(text(),'${theData}')]`;
        } else {
            throw new Error(`Invalid typeText: "${typeText}". Allowed values are "text", "contains text".`);
        }

        if (typeVerify === 'be') {
            await expect($(selector)).toBeExisting();
        } else if (typeVerify === 'not') {
            await expect($(selector)).not.toBeExisting();
        } else {
            throw new Error(`Invalid typeVerify: "${typeVerify}". Allowed values are "be", "not".`);
        }
    }
);


