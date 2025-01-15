import { Given, When, Then } from '@wdio/cucumber-framework';

import { sessionVariable } from '../mappers/mapperUtils';
import helperApi from '../helperApi/helperApi';
import { World } from '../helperApi/helperGlobal';
import { setWorldConstructor } from '@cucumber/cucumber';
import { assert } from 'chai';

Given(/^User get data json template (.*)$/, async function (this: World, fileName: string) {
    const scenarioName: string | undefined = sessionVariable.get('scenarioName');
    const parentFolder: string | null = scenarioName && scenarioName.startsWith('/') ? scenarioName.substring(0, scenarioName.indexOf(' ')) : null;

    this.map = await helperApi.fileToJsonObjectSimple(parentFolder, fileName);

    // Safely access properties from the map
    this.endpoint = this.map["endpoint"];
    this.headers = helperApi.objectToMap(this.map["headers"]);
    this.body = helperApi.toJsonObjectOrArray(this.map["body"]);
    this.param = helperApi.objectToMap(this.map["queryParam"]);
    this.service = this.map["service"];

    // console.log('map:', JSON.stringify(this.map, null, 2));
});

When(/^User update value of header :$/, async function (this: World, table) {
    // Initialize an object for header values
    // const headerValues: Record<string, any> = {};

    // Convert the Cucumber table to an object
    const rows = table.rowsHash();

    // Ensure `this.jsonData.headers` exists
    if (!this.map || !this.map.headers) {
        throw new Error('JSON data or headers is not initialized. Make sure to load the JSON template first.');
    }

    // Iterate over the object entries using Object.entries
    Object.entries(rows).forEach(([key, value]) => {
        this.map.headers[key] = value;  // Add to the object
    });

    // Assign the populated map to `this.headers`
    this.headers = this.map.headers;

    console.log('headers: ' + JSON.stringify(this.headers, null, 2));
});

When(/^User update value of param :$/, async function (this: World, table) {
    // Initialize an object for param values
    // const paramValues: Record<string, any> = {};

    // Convert the Cucumber table to an object
    const rows = table.rowsHash();

    // Ensure `this.jsonData.queryParam` exists
    if (!this.map || !this.map.queryParam) {
        throw new Error('JSON data or param is not initialized. Make sure to load the JSON template first.');
    }

    // Iterate over the object entries using Object.entries
    Object.entries(rows).forEach(([key, value]) => {
        this.map.queryParam[key] = value;  // Add to the object
    });

    // Assign the populated map to `this.param`
    this.param = this.map.queryParam;

    console.log('param: ' + JSON.stringify(this.param, null, 2));
});

When(/^User update value of body :$/, async function (this: World, table) {
    // Initialize an object for param values
    // const bodyValues: Record<string, any> = {};

    // Convert the Cucumber table to an object
    const rows = table.rowsHash();

    // Ensure `this.jsonData.body` exists
    if (!this.map || !this.map.body) {
        throw new Error('JSON data or body is not initialized. Make sure to load the JSON template first.');
    }

    // Iterate over the object entries using Object.entries
    Object.entries(rows).forEach(([key, value]) => {
        this.map.body[key] = value;  // Add to the object
    });

    // Assign the populated map to `this.body`
    this.body = this.map.body;

    console.log('body: ' + JSON.stringify(this.body, null, 2));
});

When(/^User update value of endpoint using (last|between|full|betweenLast) (.*)$/, async function (this: World, type: string, value: string) {
    const data: any = await helperApi.getDataSource(value);

    switch (type) {
        case 'last':
            this.endpoint = this.endpoint + '/' + data
            break;

        case "between":
            const valLastEndpointArr = value.split("}/", 2);
            const valLastEndpoint = valLastEndpointArr[1];
            this.endpoint = this.endpoint + "/" + data + "/" + valLastEndpoint;
            break;

        case "full":
            this.endpoint = data;
            break;

        default:
            throw new Error(`Invalid update value of endpoint type: ${type}`);
    }

    console.log('param: ' + JSON.stringify(this.endpoint, null, 2));
});

When(/^User send (.*) request$/, async function (this: World, method: string) {
    this.resp = await helperApi.requestSelection(method, this.service, this.endpoint, this.headers, this.body, this.param, this.form);
    this.responseBody = this.resp.data;

    console.log('responseCode: ' + JSON.stringify(this.resp.status, null, 2));
    console.log('responseBody: ' + JSON.stringify(this.responseBody, null, 2));
});

Then(/^User verify response (.*) code$/, async function (this: World, code: number) {
    assert.equal(this.resp.status, code);
});