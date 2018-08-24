const builder = require('botbuilder');

const registerHandlers = require('./registerHandlers');
const {
  defaultText,
} = require('../shared/appText');
const {
  luisApiHostName,
  luisAppId,
  luisApiKey,
  msAppId,
  msAppPassword,
} = require('../../config');

let bot;
let connector;

const init = () => {
  connector = new builder.ChatConnector({
    appId: msAppId,
    appPassword: msAppPassword,
  });

  // This is the default handler
  const inMemoryStorage = new builder.MemoryBotStorage();
  bot = new builder.UniversalBot(connector, (session) => {
    session.send(defaultText);
  }).selectActiveDialogRoute('storage', inMemoryStorage);

  const luisModelUrl = `https://${luisApiHostName}/luis/v2.0/apps/${luisAppId}?subscription-key=${luisApiKey}&verbose=true`;
  const recognizer = new builder.LuisRecognizer(luisModelUrl);
  bot.recognizer(recognizer);

  registerHandlers(bot);

  return {
    connector,
    bot,
  };
};

const singleton = () => {
  if (!bot) {
    init();
  }
  return {
    bot,
    connector,
  };
};

module.exports = singleton;
