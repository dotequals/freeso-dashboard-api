const { dialogflow } = require('actions-on-google');

const { defaultText, welcomeText } = require('../shared/appText');

let bot;
const init = () => {
  bot = dialogflow();

  bot.intent('Default Welcome Intent', (conv) => {
    conv.ask(welcomeText);
  });

  bot.intent('Default Fallback Intent', (conv) => {
    conv.ask(defaultText);
  });
};

const singleton = () => {
  if (!bot) {
    init();
  }
  return bot;
};

module.exports = singleton;
