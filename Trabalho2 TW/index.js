
const http = require('http');
const url = require('url');
let port = 8136;
const headers = require("./headers.js").headers;
const methods = require("./methods.js");

const server = http.createServer(function (request, response) {
  const parsedLink = url.parse(request.url, true);
  let pathname = parsedLink.pathname;
  let body = "";
  switch (request.method) {
    case 'POST':
      request.on('data', (chunk) => { body += chunk; })
        .on('end', () => {
          try {
            let query = JSON.parse(body);
            methods.methodPost(pathname, request, query, response);
          }
            catch (err) {
              console.log(err);
            }
          })
          .on('error', (err) => {
            console.log(err.message);
          });
      break;

    case 'GET':
      request.on('data', (chunk) => {
        body += chunk;
      })
        .on('end', () => {
          let query = parsedLink.query;
          methods.methodGet(pathname, request, query, response);
        })
        .on('error', (err) => {
          console.log(err.message);
        });
      break;
    default:
      response.writeHead(404, headers.plain);
      response.end();
      break;
  }

});
server.listen(port);
  