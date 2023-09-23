import { strictEqual, deepStrictEqual } from 'assert';
import DataService from '../src/index';
import nock from 'nock';

describe('DataService', () => {
    describe('getResponse', () => {
        DataService.setBasePath('https://www.fakeUrl.com');
        it('should receive an OK response', async () => {
            nock('https://www.fakeUrl.com').get('/cheesecake').reply(200, {});

            let response = await DataService.getResponse('cheesecake', {
                method: 'GET',
                credentials: 'include'
            });
            strictEqual(response.status, 200);
        });

        it('should not redirect on a 401 response when the redirectUrl isn\'t set.', async () => {
            nock('https://www.fakeUrl.com').get('/cheesecake').reply(401, {});
            //Node doesn't have "window", so test with "globalThis", which brings in the "window" object on browsers.
            globalThis.location = { href: 'george' };
            let response = await DataService.getResponse('cheesecake', {
                method: 'GET',
                credentials: 'include'
            }).catch(err => {
                strictEqual(err.status, 401);
                strictEqual(globalThis.location.href, 'george');
            });
        });

        it('should redirect on a 401 response when the redirectUrl is set.', async () => {
            DataService.setRedirectUrl('https://www.fakeurl.com/failure');
            nock('https://www.fakeUrl.com').get('/cheesecake').reply(401, {});
            //Node doesn't have "window", so test with "globalThis", which brings in the "window" object on browsers.
            globalThis.location = { href: 'george' };
            let response = await DataService.getResponse('cheesecake', {
                method: 'GET',
                credentials: 'include'
            }).catch(err => {
                strictEqual(err.status, 401);
                strictEqual(globalThis.location.href, 'https://www.fakeurl.com/failure');
            });
        });

        it('should add headers to requests', async () => {
            DataService.addHeader('cheese', 'cake');
            nock('https://www.fakeUrl.com').get('/cheesecake').reply(200, function () {
                deepStrictEqual(this.req.headers.cheese, ['cake']);
            });

            let response = await DataService.getResponse('cheesecake', {
                method: 'GET',
                credentials: 'include'
            });
            strictEqual(response.status, 200);
        });

        it('should remove headers from requests', async () => {
            DataService.removeHeader('cheese');
            nock('https://www.fakeUrl.com').get('/cheesecake').reply(200, function () {
                strictEqual(this.req.headers.cheese, undefined);
            });

            let response = await DataService.getResponse('cheesecake', {
                method: 'GET',
                credentials: 'include'
            });
            strictEqual(response.status, 200);
        });
    });

    describe("get", () => {
        it("can return json response", async () => {
            let expected = "passed";
            nock('https://www.fakeUrl.com').get('/cheesecake').reply(200, { test: expected });
            let response = await DataService.get('cheesecake').json();
            strictEqual(response.test, expected);
        });
    });

    describe("post", () => {
        it("can post", async () => {
            let expected = "passed";
            nock('https://www.fakeUrl.com')
                .post('/cheesecake')
                .reply(200, (url, body) => {
                    strictEqual(body.test, expected);
                    return body;
                });
            await DataService.post('cheesecake', { test: expected }).json();
        });

        it("can get json Response", async () => {
            let expected = "passed";
            nock('https://www.fakeUrl.com')
                .post('/cheesecake')
                .reply(200, (url, body) => {
                    return body;
                });
            let response = await DataService.post('cheesecake', { test: expected }).json();
            strictEqual(response.test, expected);
        });
    });

    describe("patch", () => {
        it("can patch", async () => {
            let expected = "passed";
            nock('https://www.fakeUrl.com')
                .patch('/cheesecake')
                .reply(200, (url, body) => {
                    strictEqual(body.test, expected);
                    return body;
                });
            await DataService.patch('cheesecake', { test: expected }).json();
        });

        it("can get json Response", async () => {
            let expected = "passed";
            nock('https://www.fakeUrl.com')
                .patch('/cheesecake')
                .reply(200, (url, body) => {
                    return body;
                });
            let response = await DataService.patch('cheesecake', { test: expected }).json();
            strictEqual(response.test, expected);
        });
    });

    describe("put", () => {
        it("can put", async () => {
            let expected = "passed";
            nock('https://www.fakeUrl.com')
                .put('/cheesecake')
                .reply(200, (url, body) => {
                    strictEqual(body.test, expected);
                    return body;
                });
            await DataService.put('cheesecake', { test: expected }).json();
        });

        it("can get json Response", async () => {
            let expected = "passed";
            nock('https://www.fakeUrl.com')
                .put('/cheesecake')
                .reply(200, (url, body) => {
                    return body;
                });
            let response = await DataService.put('cheesecake', { test: expected }).json();
            strictEqual(response.test, expected);
        });
    });

    describe("delete", () => {
        it("can delete", async () => {
            let expected = "passed";
            nock('https://www.fakeUrl.com').delete('/cheesecake').reply(200, { test: expected });
            let response = await DataService.delete('cheesecake').json();
            strictEqual(response.test, expected);
        });
    });
});