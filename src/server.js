const http = require('http');
const url = require('url');

const responses = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handlers = {
  GET: {
    '/': responses.getIndex,
    '/style.css': responses.getStyle,
    '/getUsers': responses.getUsers,
    notFound: responses.notFound,
  },
  HEAD: {
    '/getUsers': responses.getUsersMeta,
    notFound: responses.notFoundMeta,
  },
  POST: {
    '/addUser': (req, res) => responses.parseBody(req, res, responses.addUser),
  },
};

function onRequest(req, res) {
  const reqPath = url.parse(req.url, true).pathname;
  if (handlers[req.method]) {
    if (handlers[req.method][reqPath]) {
      handlers[req.method][reqPath](req, res);
    } else if (handlers[req.method].notFound) {
      handlers[req.method].notFound(req, res);
    } else {
      responses.baseNotFound(req, res);
    }
  }
}

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
