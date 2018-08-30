const { dialogflow } = require('actions-on-google');

const registerHandlers = require('./registerHandlers');

let bot;
const init = () => {
  bot = dialogflow();
  registerHandlers(bot);
};

const singleton = () => {
  if (!bot) {
    init();
  }
  return bot;
};

module.exports = singleton;
