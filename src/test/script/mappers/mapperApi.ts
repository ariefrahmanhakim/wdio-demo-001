import { promises as fs } from 'fs';
import * as path from 'path';
import assert from 'assert';
import * as yaml from 'js-yaml';

export class mapperApi {
    static async fullPathByName(parentFolder: string, fileName: string): Promise<string> {
        const fullName = `${fileName}.json`;
        const result: string[] = [];

        async function findFile(dir: string) {
            const files = await fs.readdir(dir, { withFileTypes: true });
            for (const file of files) {
                const filePath = path.join(dir, file.name);
                if (file.isDirectory()) {
                    await findFile(filePath);
                } else if (file.name.toLowerCase() === fullName.toLowerCase()) {
                    try {
                        await fs.access(filePath);
                        result.push(filePath);
                    } catch {
                        // Ignore unreadable files
                    }
                }
            }
        }

        await findFile(parentFolder);

        assert.strictEqual(result.length, 1, "File not found or multiple files detected.");
        const fullPath = result[0];

        return fullPath;
    }

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
            const fileContent = await fs.readFile(propertiesFilePath, 'utf8');
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

    static async getStaticData(dataValue: string): Promise<any> {
        const pathSegments = dataValue.split(".");
        const ENV = process.env.ENV || "local";

        const filePath = path.resolve(
            'src/main/resources/assets/staticData/api',
            `${pathSegments[0]}.yml`
        );

        try {
            const fileContent = await fs.readFile(filePath, 'utf8');
            const data = yaml.load(fileContent) as Record<string, any>;
            const theKeys = data[pathSegments[1]];

            if (!theKeys) {
                throw new Error(`Key "${pathSegments[1]}" not found in YAML: ${filePath}`);
            }

            const staticDataValue = theKeys[ENV];

            if (!staticDataValue) {
                throw new Error(`No value found for environment "${ENV}" in key "${pathSegments[1]}".`);
            }

            return staticDataValue;
        } catch (error) {
            throw new Error(`Error reading static data: ${error.message}`);
        }
    }

    static async getTranslation(dataValue: string): Promise<any> {
        const pathSegments = dataValue.split(".");
        const ENV = process.env.TRANS || "en";

        const filePath = path.resolve(
            'src/main/resources/assets/translation/api',
            `${pathSegments[0]}.yml`
        );

        try {
            const fileContent = await fs.readFile(filePath, 'utf8');
            const data = yaml.load(fileContent) as Record<string, any>;
            const translationKeys = data[pathSegments[1]];

            if (!translationKeys) {
                throw new Error(`Key "${pathSegments[1]}" not found in YAML: ${filePath}`);
            }

            const translationValue = translationKeys[ENV];

            if (!translationValue) {
                throw new Error(`No translation found for environment "${ENV}" in key "${pathSegments[1]}".`);
            }

            return translationValue;
        } catch (error) {
            throw new Error(`Error reading translation: ${error.message}`);
        }
    }
}
