import Delete from "./Delete";
import Get from "./Get";
import Patch from "./Patch";
import Post from "./Post";
import Put from "./Put";

/**
 * @class Data
 * @description Provides consistent functionality for sending and receiving data from an API
 * */
export default class Data {
    private pathPrefix?: string;
    private redirectUrl?: string;
    private headers: Record<string, string> = {};
    private alwaysForceStaticReload?: boolean;

    /**
     * @constructor
    */
    constructor() {
        this.addHeader('Content-Type', 'application/json');
    }

    /**
     * Toggles functionality to force browser to reload static pages rather than using the local cache
     * @param {boolean} force
     * @function
    */
    setAlwaysForceStaticReload = (force: boolean) => {
        this.alwaysForceStaticReload = force;
    }

    /**
     * Sets the base path for the API connection
     * @param {string} basePath
     * @function
     */
    setBasePath = (basePath: string) => {
        this.pathPrefix = basePath;
    }

    /**
     * Sets the redirect url for 401 (Unauthorized) responses
     * @param {string} url
     * @function
     */
    setRedirectUrl = (url: string) => {
        this.redirectUrl = url;
    }

    /**
     * Adds a header to all outgoing requests
     * @param {string} name
     * @param {string} header
     */
    addHeader = (name: string, header: string) => {
        this.headers[name] = header;
    }

    /**
     * Removes the specified header from future requests
     * @param {string} name
     */
    removeHeader = (name: string) => {
        delete this.headers[name];
    }

    /**
     * Performs an HTTP request using the predefined baseUrl.
     * @function
     * @param {string} path - The path to request from.
     * @param {RequestInit} options - Request options used in the http request.
    */
    getResponse = async (path: string, options: RequestInit, forceStaticReload?: boolean): Promise<Response> => {
        if (forceStaticReload) {
            path = this.appendQueryModifier(path);
        }
        let prefix = this.pathPrefix ? `${this.pathPrefix}/` : '';
        options.headers = this.headers;
        const response = await fetch(`${prefix}${path}`, options);
        return await new Promise((succeed, fail) => {
            if (response.status >= 200 && response.status < 400) {
                succeed(response);
            } else {
                if (response.status === 401 && this.redirectUrl) {
                    globalThis.location.href = this.redirectUrl;
                }
                fail(response);
            }
        });
    }

    /**
     * Returns a {@link Get} object
     * @param {string} path - The URL to retrieve
     * @function
    */
    get = (path: string, forceStaticReload?: boolean) => new Get(this, path, forceStaticReload || this.alwaysForceStaticReload || false);

    /**
     * Returns a {@link Post} object
     * @param {string} path - The URL to retrieve
     * @param {any | void} body - The request body of the call
     * @function
    */
    post = (path: string, body: any | void) => new Post(this, path, body);

    /**
    * Returns a {@link Patch} object
    * @param {string} path - The URL to retrieve
    * @param {any | void} body - The request body of the call
    * @function
   */
    patch = (path: string, body: any | void) => new Patch(this, path, body);

    /**
     * Returns a {@link Put} object
     * @param {string} path - The URL to retrieve
     * @param {any | void} body - The request body of the call
     * @function
    */
    put = (path: string, body: any | void) => new Put(this, path, body);

    /**
     * Returns a {@link Get} object
     * @param {string} path - The URL to retrieve
     * @function
    */
    delete = (path: string) => new Delete(this, path);

    private appendQueryModifier = (path: string): string => {
        if (path.indexOf('?') > -1) {
            path = `${path}&r=${(new Date()).getTime()}`;
        } else {
            path = `${path}?r=${(new Date()).getTime()}`;
        }
        return path;
    }
}