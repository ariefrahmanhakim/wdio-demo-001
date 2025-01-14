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
}
