const users = {};

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
