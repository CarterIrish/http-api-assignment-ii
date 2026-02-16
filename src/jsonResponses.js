const users = {};

/**
 * Sends a 404 Not Found JSON response. Omits the body for HEAD requests.
 * @param {object} request - The HTTP request object.
 * @param {object} response - The HTTP response object.
 */
const notFound = (request, response) => {
    const responseJSON = {
        message: "The page you are looking for was not found.",
        id: "notFound"
    }
    response.writeHead(404, { "Content-Type": "application/json" });
    if (request.method !== "HEAD") {
        response.write(JSON.stringify(responseJSON));
    }
    response.end();
}

/**
 * Handles POST requests to add or update a user.
 * Returns 400 if name or age is missing, 204 if updating an existing user,
 * or 201 if creating a new user.
 * @param {object} request - The HTTP request object with parsed body.
 * @param {object} response - The HTTP response object.
 */
const addUser = (request, response) => {
    const { name, age } = request.body;
    if (!name || !age) {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify({ message: "Name and age are both required.", id: "addUserMissingParams" }));
        response.end();
        return;
    }
    else if (users[name]) {
        users[name].age = age;
        response.writeHead(204, { "Content-Type": "application/json" });
        response.end();
    }
    else {
        users[name] = { name, age };
        response.writeHead(201, { "Content-Type": "application/json" });
        response.write(JSON.stringify({ message: "Created Successfully" }));
        response.end();
    }
}

/**
 * Returns all users as JSON with a 200 status. Omits the body for HEAD requests.
 * @param {object} request - The HTTP request object.
 * @param {object} response - The HTTP response object.
 */
const getUsers = (request, response) => {
    response.writeHead(200, { "Content-Type": "application/json" });
    if (request.method !== "HEAD") {
        response.write(JSON.stringify({ users }));
    }
    response.end();
}

module.exports.notFound = notFound;
module.exports.addUser = addUser;
module.exports.getUsers = getUsers;
