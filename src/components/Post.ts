import Data from './Data';
import File from '../models/File'
/**
 * @class Performs functions related to the Get Http Method
 * */
export default class Post {
    constructor(private data: Data, private path: string, private body: any | void) { }

    /**
     * Performs a POST and returns the response without further processing (Except in the case of an Unauthorized response).
     */
    request = (): Promise<Response> => {
        let body = this.body ? JSON.stringify(this.body) : this.body;
        return this.data.getResponse(this.path, {
            method: 'POST',
            credentials: 'include',
            body: body
        })
    }

    /**
    * Performs a POST request and returns the value as a {@link File}.
    */
    file = async (): Promise<File> => {
        const response = await this.request();
        const blob = await response.blob();
        let contentDisposition = response.headers.get('content-disposition');
        let filename = 'File';
        if (contentDisposition.indexOf('filename=') > -1) {
            filename = contentDisposition.split('filename=')[1];
        }
        return new File(filename, blob);
    };

    /**
     * Performs a POST and returns the response as a JSON object
     */
    json = async (): Promise<any> => {
        const response = await this.request();
        const contentLength = response.headers.get("content-length");
        if (contentLength === "0") {
            return response.statusText;
        }
        return response.json();
    };
}