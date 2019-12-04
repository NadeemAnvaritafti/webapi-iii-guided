const express = require('express'); // importing a CommonJS module
const helmet = require('helmet'); // <<<< 1. import the package

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();


// custom middleware
function logger(req, res, next) {
  console.log(`${req.method} to ${req.originalUrl}`);
  next(); // allows the request to continue to the next middleware or route handler
}

// write a gatekeeper middleware that reads a password from the headers, and if the password is 'mellon' let it continue
// if not, send back status code 401 with a message

function gatekeeper(req, res, next) {
  if (req.originalUrl === '/mellon') {
    next();
  } else {
    res.status(401).send('Sorry you dont have the proper credentials');
  }
}

// apply middleware
// server.use(helmet()) // <<<<< 2. use the package (we don't want to use it globally so we comment it out then just invoke it locally in the get request at /area51)
server.use(express.json()); // built-in middleware
server.use(logger);

// endpoints
server.use('/api/hubs', hubsRouter); // this is local middleware because it only applies to /api/hubs

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

server.get('/echo', (req, res) => {
  res.send(req.headers);
})

server.get('/area51', helmet(), gatekeeper(), (req, res) => {
  res.send(req.headers);
})


module.exports = server;
