const apiServer = require('./servers/apiServer');
const wsServer = require('./servers/wsServer');

const fetchData = require('./utils/fetchData');

apiServer.init();
wsServer.init();

fetchData.scheduleFetching();
