const http = require('http');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getUsers': jsonHandler.getUsers,
    '/notReal': jsonHandler.notFound,
    '/notFound': jsonHandler.notFound
}

const parseBody = (request, response, handler) => {
    const body = [];

    request.on('error', (err) => {
        console.dir(err);
        response.statusCode = 400;
        response.end();
    });

    request.on('data', (chunk) => {
        body.push(chunk);
    });

    request.on('end', () => {
        const bodyString = Buffer.concat(body).toString();
        request.body = query.parse(bodyString);
        handler(request, response);
    });
};

const onRequest = (request, response) => {
    console.log(request.url);
    const parsedURL = new URL(request.url, `http://${request.headers.host}`);

    if (request.method === 'POST' && parsedURL.pathname === '/addUser') {
        parseBody(request, response, jsonHandler.addUser);
    } else {
        const handler = urlStruct[parsedURL.pathname] || jsonHandler.notFound;
        handler(request, response);
    }
};

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on port: ${port}`);
    console.log(`preview at: "http://localhost:${port}"`);
})