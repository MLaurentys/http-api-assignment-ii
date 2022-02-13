const { encoders } = require('./encoders.js');

const supportedMIMETypes = new Set(['application/json', 'text/xml']);

function getType(accept) {
  const possibleTypes = accept.split(',');
  for (let i = 0; i < possibleTypes.length; ++i) {
    const type = possibleTypes[i];
    if (supportedMIMETypes.has(type)) {
      return type.split('/');
    }
  }
  // todo: unsupported type error
  return ['application', 'json'];
}

module.exports.respondMeta = (res, unvalidatedAccept, statusCode = 200) => {
  const [type, subtype] = getType(unvalidatedAccept);
  res.writeHead(statusCode, { 'Content-Type': `${type}/${subtype}` });
  res.end();
};

module.exports.respond = (res, body, unvalidatedAccept, statusCode = 200) => {
  const [type, subtype] = getType(unvalidatedAccept);
  res.writeHead(statusCode, { 'Content-Type': `${type}/${subtype}` });
  res.write(encoders[subtype](body));
  res.end();
};

module.exports.mediaRespond = (res, page, type, subtype) => {
  res.writeHead(200, { 'Content-Type': `${type}/${subtype}` });
  res.write(page);
  res.end();
};
