const express = require('express');
const path = require('path');

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

  app.get('*', (req, res) => {
      res.status(404).send('404 Not Found');
  });

  const port = process.env.PORT || 3683;
  app.listen(port, () => {
      console.log(`FreeSO Dashboard API listening on ${port}`);
  });
}

module.exports = {
  init,
}