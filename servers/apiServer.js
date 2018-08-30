const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const verifier = require('alexa-verifier-middleware');

const handlers = require('../assistants/alexa/handlers');
const { connector } = require('../assistants/cortana/singleton')();
const gSingleton = require('../assistants/google/singleton');

const init = () => {
  const app = express();

  // Unmodified proxy
  app.get('/userapi/city/001/city.json', (req, res) => {
    res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.sendFile(path.resolve(__dirname, '../data/city.json'));
  });

  // Modified into key/value pairs
  app.get('/api/v2/city/1/', (req, res) => {
    res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.sendFile(path.resolve(__dirname, '../data/cityV2.json'));
  });

  // Create a router and use the verification middleware for every route on the router
  const alexaRouter = express.Router();
  app.use('/api/alexa', alexaRouter);
  alexaRouter.use(verifier);

  app.post('/api/alexa', (req, res) => {
    const skill = handlers();

    skill.invoke(req.body)
      .then(responseBody => res.json(responseBody))
      .catch(() => res.status(500).send('An error occured.'));
  });

  app.post('/api/cortana', connector.listen());

  const gAssistant = gSingleton();
  const gRouter = express.Router();
  gRouter.use(bodyParser.json());
  app.use('/api/google', gRouter);
  app.post('/api/google', gAssistant);

  // Just send a 404 for any other endpoint
  app.get('*', (req, res) => {
    res.status(404).send('404 Not Found');
  });

  const port = process.env.PORT || 3683;
  app.listen(port, () => {
    console.log(`FreeSO Dashboard API listening on ${port}`);
  });
};

module.exports = {
  init,
};
