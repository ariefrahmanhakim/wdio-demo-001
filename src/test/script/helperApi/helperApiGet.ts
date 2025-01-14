import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export default class helperApiGet {
    // Making an HTTP GET request using axios
    public static async requestGet(url: string, headers: Record<string, any>): Promise<AxiosResponse> {
        try {
            // Prepare the request configuration
            const config: AxiosRequestConfig = {
                headers: headers
            };

            // Make the GET request
            const response: AxiosResponse = await axios.get(url, config);

            // Return the response object
            return response;
        } catch (error) {
            // Handle errors
            console.error("Error in GET request:", error);
            throw new Error('GET request failed');
        }
    }
}
