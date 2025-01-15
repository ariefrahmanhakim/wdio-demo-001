import * as path from 'path';
import * as fs from 'fs';
import { mapperApi } from '../mappers/mapperApi';
import helperApiGet from '../helperApi/helperApiGet';
import axios, { AxiosResponse } from 'axios';
import helperApiPost from './helperApiPost';

export default class helperApi {

    public static async fileToJsonObjectSimple(parentFolder: string | null, fileName: string): Promise<Record<string, any>> {
        let jsonObject: Record<string, any> = {};

        try {
            // Get the full path of the file
            const fullPath = await this.setParentFolder(parentFolder, fileName);

            // Read and parse JSON file
            const fileContent = await fs.readFileSync(fullPath, 'utf-8');
            jsonObject = JSON.parse(fileContent);

        } catch (error) {
            console.error('Error reading or parsing JSON file:', error);
            throw new Error('Failed to load JSON file');
        }

        return jsonObject;
    }

    static async setParentFolder(parentFolder: string | null, fileName: string): Promise<string> {
        if (!parentFolder) {
            parentFolder = '/src/main/resources/assets/api/';
        }

        const dataPath = path.join(process.cwd(), parentFolder);
        const fullPath = await mapperApi.fullPathByName(dataPath, fileName);

        return fullPath;
    }


    public static objectToMap(obj: any): Map<string, any> {
        if (obj == null) {
            return obj;
        }

        const map = new Map<string, any>();

        try {
            // Convert the object to a JSON string
            const jsonString = JSON.stringify(obj);

            // Parse the JSON string back to an object
            const parsedObject: Record<string, any> = JSON.parse(jsonString);

            // Populate the map with key-value pairs
            Object.entries(parsedObject).forEach(([key, value]) => {
                map.set(key, value);
            });
        } catch (error) {
            console.error('Error converting object to map:', error);
            throw new Error('Failed to convert object to map');
        }

        return map;
    }

    public static toJsonObjectOrArray(input: any): object | any[] {
        if (input == null) {
            return input;
        }

        if (typeof input === 'string') {
            const str = input.trim();

            if (str.startsWith('{')) {
                return this.jsonStringToJsonObject(str);
            } else if (str.startsWith('[')) {
                return this.jsonStringToJsonArray(str);
            } else {
                throw new Error('Unknown string format. Input must be a valid JSON object or array.');
            }
        } else if (typeof input === 'object') {
            // If the input is already an object, return it directly
            return input;
        } else {
            throw new Error('Input must be a valid JSON object or array, or a string representing one.');
        }
    }

    public static jsonStringToJsonObject(jsonString: string): object {
        try {
            const parsed = JSON.parse(jsonString);
            if (typeof parsed === 'object' && parsed !== null) {
                return parsed;
            } else {
                throw new Error('Provided string is not a JSON object');
            }
        } catch (error) {
            console.error('Error parsing JSON object:', error);
            throw new Error('Invalid JSON object format');
        }
    }

    public static jsonStringToJsonArray(jsonString: string): any[] {
        try {
            const parsed = JSON.parse(jsonString);
            if (Array.isArray(parsed)) {
                return parsed;
            } else {
                throw new Error('Provided string is not a JSON array');
            }
        } catch (error) {
            console.error('Error parsing JSON array:', error);
            throw new Error('Invalid JSON array format');
        }
    }

    public static async requestSelection(method: string, service: string, endpoint: string, headers: Record<string, any>, body: any, param: Record<string, any>, form: Record<string, any>): Promise<any> {
        const url = `${await mapperApi.getProperties(service)}${endpoint}`;
        let resp: any;

        switch (method.toLowerCase()) {
            case 'get':
                resp = await helperApiGet.requestGet(url, headers);
                break;

            case 'getparam':
                resp = await helperApiGet.requestGetParam(url, headers, param);
                break;

            case 'post':
                resp = await helperApiPost.requestPost(url, headers, body);
                break;

            default:
                throw new Error("Method not found");
        }

        return resp;

    }

    static async getDataSource(value: string): Promise<any> {
        let theData: any;

        if (value.includes('{') && value.includes('}')) {
            const insideCurlyStr = value.substring(value.indexOf("{") + 1, value.indexOf("}"));
            const split = insideCurlyStr.split("-");
            // console.log(insideCurlyStr);
            // console.log(split[0]);
            // console.log(split[1]);

            switch (split[0]) {
                case "data":
                    theData = split[1];
                    break;

                case "properties":
                    theData = mapperApi.getProperties(split[1]);
                    break;

                case "staticData":
                    theData = mapperApi.getStaticData(split[1]);
                    break;

                case "translation":
                    theData = mapperApi.getTranslation(split[1]);
                    break;

                default:
                    throw new Error(`Invalid type get data source: ${split[0]}`);
            }
            return theData;
        }
        return value;
    }

}
