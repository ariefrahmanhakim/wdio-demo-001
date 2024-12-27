import { browser } from '@wdio/globals'
import mapperWeb from '../mappers/mapperWeb';

export default class helperBrowser {

    static async openUrl(url: string): Promise<any> {
        if (!url) {
            throw new Error("URL is required to open a page.");
        }
        await browser.url(url);
    }

    static async getDataSource(path: string, type: string, data: string): Promise<any> {
        let theData: any;

        switch (type) {
            case "data":
                theData = data;
                break;

            case "properties":
                theData = mapperWeb.getProperties(data);
                break;

            case "staticData":
                theData = mapperWeb.getStaticData(path, data);
                break;

            case "translation":
                theData = mapperWeb.getTranslation(path, data);
                break;

            default:
                throw new Error(`Invalid type: ${type}`);
        }

        return theData;
    }


}
