import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export default class helperApiPost {
    public static async requestPost(url: string, headers: Record<string, any>, body: any): Promise<AxiosResponse> {
        try {
            // Prepare the request configuration
            const config: AxiosRequestConfig = {
                headers: headers,
                validateStatus: (status) => {
                    // Return true for all status codes to treat them as valid responses
                    return status >= 200 && status < 600;  // Treat all 2xx and 4xx/5xx as successful
                }
            };

            // Make the POST request
            const response: AxiosResponse = await axios.post(url, body, config);

            // Return the response object
            return response;
        } catch (error) {
            // Handle errors
            console.error("Error in POST request:", error);
            throw new Error('POST request failed');
        }
    }

}
