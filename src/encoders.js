function encodeXML(message) {
  let rStr = '';
  Object.keys(message).forEach((k) => {
    rStr += `<${k}>${message[k]}</${k}>`;
  });
  return `<response>${rStr}</response>`;
}

function encodeJSON(message) {
  return JSON.stringify(message);
}

function echo(message) {
  return message;
}

module.exports.encoders = {
  xml: encodeXML,
  json: encodeJSON,
  html: echo,
  css: echo,
};
