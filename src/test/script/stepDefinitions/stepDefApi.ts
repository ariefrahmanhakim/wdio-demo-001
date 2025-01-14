import { Given, When, Then } from '@wdio/cucumber-framework';

import { sessionVariable } from '../mappers/mapperUtils';
import helperApi from '../helperApi/helperApi';
import { World } from '../helperApi/helperGlobal';
import { setWorldConstructor } from '@cucumber/cucumber';
import { assert } from 'chai';

Given(/^User get data json template (.*)$/, async function (this: World, fileName: string) {
    const scenarioName: string | undefined = sessionVariable.get('scenarioName');
    const parentFolder: string | null = scenarioName && scenarioName.startsWith('/')? scenarioName.substring(0, scenarioName.indexOf(' ')): null;

    this.map = await helperApi.fileToJsonObjectSimple(parentFolder, fileName);
    
    // Safely access properties from the map
    this.endpoint = this.map["endpoint"];
    this.headers = helperApi.objectToMap(this.map["headers"]);
    this.body = helperApi.toJsonObjectOrArray(this.map["body"]);
    this.param = helperApi.objectToMap(this.map["queryParam"]);
    this.service = this.map["service"];

    // Properly log the map and its properties
    // console.log('map:', JSON.stringify(this.map, null, 2)); // Pretty print map
});

When(/^User send (.*) request$/, async function (this: World, method: string) {
    this.resp = await helperApi.requestSelection(method, this.service, this.endpoint, this.headers, this.body, this.param, this.form);
    this.responseBody = this.resp.data; 
});

Then(/^User verify response (.*) code$/, async function (this: World, code: number) {
    assert.equal(this.resp.status, code);
});