import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export default class helperApiGet {
    public static async requestGet(url: string, headers: Record<string, any>): Promise<AxiosResponse> {
        try {
            // Prepare the request configuration
            const config: AxiosRequestConfig = {
                headers: headers,
                validateStatus: (status) => {
                    // Return true for all status codes to treat them as valid responses
                    return status >= 200 && status < 600;  // Treat all 2xx and 4xx/5xx as successful
                }
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

    public static async requestGetParam(url: string, headers: Record<string, any>, param: Record<string, any>): Promise<AxiosResponse> {
        try {
            // Prepare the request configuration
            const config: AxiosRequestConfig = {
                headers: headers,
                params: param,
                validateStatus: (status) => {
                    // Return true for all status codes to treat them as valid responses
                    return status >= 200 && status < 600;  // Treat all 2xx and 4xx/5xx as successful
                }
            };

            // Make the GET request
            const response: AxiosResponse = await axios.get(url, config);

            // Return the response object
            return response;
        } catch (error) {
            // Handle errors
            console.error("Error in GET PARAM request:", error);
            throw new Error('GET PARAM request failed');
        }
    }

}
