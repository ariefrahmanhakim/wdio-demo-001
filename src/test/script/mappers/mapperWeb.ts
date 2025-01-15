import { $ } from '@wdio/globals'
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export default class mapperWeb {

    static async getProperties(key: string): Promise<string> {
        const properties: { [key: string]: string } = {};
        const ENV = process.env.ENV || 'local';

        let propertiesFilePath: string;
        if (ENV.toLowerCase() === 'local') {
            propertiesFilePath = path.resolve('src/main/resources/local.properties');
        } else if (ENV.toLowerCase() === 'staging') {
            propertiesFilePath = path.resolve('src/main/resources/staging.properties');
        } else {
            propertiesFilePath = path.resolve('src/main/resources/production.properties');
        }

        // Read and parse the properties file
        try {
            const fileContent = fs.readFileSync(propertiesFilePath, 'utf8');
            fileContent.split(/\r?\n/).forEach((line) => {
                const [key, value] = line.split('=');
                if (key && value) {
                    properties[key.trim()] = value.trim().replace(/"/g, '');
                }
            });
        } catch (error) {
            throw new Error(`Error reading properties file: ${error.message}`);
        }

        // Retrieve the property value
        const result = properties[key];
        if (!result) {
            throw new Error(`Property "${key}" not found in ${propertiesFilePath}`);
        }

        return result;
    }

    public static getElement(tmpPath: string, elDt: string): string[] {
        const elLoc = `${tmpPath}/${elDt}`;
        let path = elLoc.split('/');
        const lastPath = path[path.length - 1];

        path = this.removeLastElement(path);
        const pathData = path.join('/');

        const filePath = `src/main/resources/assets/webElements/${pathData}.yml`;
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        const inputStream = fs.readFileSync(filePath, 'utf8');
        const data = yaml.load(inputStream) as Record<string, any>;

        if (!data || !data[lastPath]) {
            throw new Error(`Key not found in YAML: ${lastPath}`);
        }

        const stringData = data[lastPath] as string;
        const parts = stringData.split(':', 2);

        return parts;
    }

    private static removeLastElement(arr: string[]): string[] {
        return arr.slice(0, -1);
    }

    public static getStaticData(path: string, keys: string): string {
        let frontPath: string;

        if (path.includes('/')) {
            const thePath = path.split('/');
            frontPath = thePath[thePath.length - 2];
        } else {
            frontPath = path;
        }

        const ENV = process.env.ENV || 'local';

        // Read the YAML file
        const filePath = `src/main/resources/assets/staticData/web/${frontPath}.yml`;
        let data: any;
        try {
            const fileContents = fs.readFileSync(filePath, 'utf8');
            data = yaml.load(fileContents) as Record<string, any>;
        } catch (err) {
            throw new Error(`File not found: ${filePath}`);
        }

        const theKeys = data[keys] as Record<string, string>;
        if (!theKeys) {
            throw new Error(`Key "${keys}" not found in the YAML file.`);
        }

        const dataValue = theKeys[ENV];
        if (!dataValue) {
            throw new Error(`No value found for environment "${ENV}".`);
        }

        return dataValue;
    }

    public static async getTranslation(path: string, keys: string): Promise<string> {
        let frontPath: string;

        if (path.includes('/')) {
            const thePath = path.split('/');
            frontPath = thePath[thePath.length - 2];
        } else {
            frontPath = path;
        }

        const TRANS = process.env.TRANS || 'en';

        const filePath = `src/main/resources/assets/translation/web/${frontPath}.yml`;

        // Load YAML file and parse its content
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data: Record<string, any> = yaml.load(fileContent) as Record<string, any>;

        if (!data[keys]) {
            throw new Error(`Key "${keys}" not found in the translation file.`);
        }

        const values: Record<string, string> = data[keys] as Record<string, string>;

        if (!values[TRANS]) {
            throw new Error(`Translation "${TRANS}" not found for key "${keys}".`);
        }

        return values[TRANS];
    }

}