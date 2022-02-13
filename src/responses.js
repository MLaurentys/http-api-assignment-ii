const fs = require('fs');
const query = require('querystring');

const { respond, respondMeta, mediaRespond } = require('./adapters.js');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const styleCss = fs.readFileSync(`${__dirname}/../client/style.css`);

const responses = {
  created: {
    message: 'Created Successfully',
  },
  addUserMissingParam: {
    id: 'addUserMissingParam',
    message: 'Name and age are both required',
  },
  notFound: {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  },
};

const database = {};

function parseBody(request, response, handler) {
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
    const bodyParams = query.parse(bodyString);
    handler(request, response, bodyParams);
  });
}

function getIndex(req, res) {
  mediaRespond(res, index, 'text', 'html');
}

function getStyle(req, res) {
  mediaRespond(res, styleCss, 'text', 'css');
}

function addUser(req, res, bodyParams) {
  if (bodyParams.name === '' || bodyParams.age === '') {
    return respond(res, responses.addUserMissingParam, req.headers.accept, 400);
  }
  if (database[bodyParams.name]) {
    database[bodyParams.name] = bodyParams.age;
    return respond(res, '', req.headers.accept, 204);
  }
  database[bodyParams.name] = bodyParams.age;
  return respond(res, responses.created, req.headers.accept, 201);
}

function getUsers(req, res) {
  return respond(res, database, req.headers.accept, 200);
}

function getUsersMeta(req, res) {
  return respondMeta(res, req.headers.accept, 200);
}

function notFound(req, res) {
  respond(res, responses.notFound, req.headers.accept, 404);
}

function notFoundMeta(req, res) {
  respondMeta(res, req.headers.accept, 404);
}

module.exports = {
  getIndex,
  getStyle,
  notFound,
  addUser,
  parseBody,
  getUsers,
  getUsersMeta,
  notFoundMeta,
  baseNotFound: notFound,
};
