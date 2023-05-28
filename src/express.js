// const http = require('http');
// const bodyParser = require('body-parser');

// function express() {
//   const routes = [];
//   const jsonParser = bodyParser.json();

//   function get(route, handler) {
//     routes.push({ method: 'GET', route, handler });
//   }

//   function post(route, handler) {
//     routes.push({ method: 'POST', route, handler });
//   }

//   function put(route, handler) {
//     routes.push({ method: 'PUT', route, handler });
//   }

//   function delet(route, handler) {
//     routes.push({ method: 'DELETE', route, handler });
//   }

//   function listen(port, callback) {
//     const server = http.createServer((req, res) => {
//       const { url, method } = req;
//       const route = routes.find(r => r.route === url && r.method === method);

//       if (route) {
//         if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
//           jsonParser(req, res, () => {
//             sendResponse(res, route.handler(req, res));
//           });
//         } else {
//           sendResponse(res, route.handler(req, res));
//         }
//       } else {
//         res.statusCode = 404;
//         res.end('Not Found');
//       }
//     });

//     server.listen(port, callback);
//   }

//   function sendResponse(res, data) {
//     if (typeof data === 'string') {
//       res.setHeader('Content-Type', 'text/plain');
//       res.end(data);
//     } else if (typeof data === 'object') {
//       res.setHeader('Content-Type', 'application/json');
//       res.end(JSON.stringify(data));
//     } else {
//       res.end();
//     }
//   }
  

//   return {
//     get, post, put, delete: delet, listen
//   };
// }

// module.exports = express;


const http = require('http');

function express() {
  const routes = [];

  function get(route, handler) {
    routes.push({ method: 'GET', route, handler });
  }

  function post(route, handler) {
    routes.push({ method: 'POST', route, handler });
  }

  function put(route, handler) {
    routes.push({ method: 'PUT', route, handler });
  }

  function delet(route, handler) {
    routes.push({ method: 'DELETE', route, handler });
  }

  function listen(port, callback) {
    const server = http.createServer((req, res) => {
      const { url, method } = req;
      const route = routes.find(r => r.route === url && r.method === method);

      if (route) {
        let data = '';
        req.on('data', chunk => {
          data += chunk;
        });

        req.on('end', () => {
          req.body = JSON.parse(data || '{}');
          req.params = {};
          const queryString = url.split('?')[1];
          if (queryString) {
            const queryParams = new URLSearchParams(queryString);
            for (const [key, value] of queryParams.entries()) {
              req.query[key] = value;
            }
          }

          sendResponse(res, route.handler(req, res));
        });
      } else {
        res.statusCode = 404;
        res.end('Not Found');
      }
    });

    server.listen(port, callback);
  }

  function sendResponse(res, data) {
    if (typeof data === 'string') {
      res.setHeader('Content-Type', 'text/plain');
      res.end(data);
    } else if (typeof data === 'object') {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    } else {
      res.end();
    }
  }

  return {
    get,
    post,
    put,
    delete: delet,
    listen,
  };
}

module.exports = express;
