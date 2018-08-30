const { defaultText, helpText, welcomeText } = require('../shared/appText');

const { countLots, countSims, getBusiestLots } = require('../shared/fulfillments');

const registerHandlers = (bot) => {
  bot.intent('Default Welcome Intent', (conv) => {
    conv.ask(welcomeText);
  });

  bot.intent('Default Fallback Intent', (conv) => {
    conv.ask(defaultText);
  });

  bot.intent('HelpIntent', (conv) => {
    conv.ask(helpText);
  });

  bot.intent('OnlineSims', async (conv) => {
    const speechText = await countSims();
    conv.ask(speechText);
  });

  bot.intent('OnlineLots', async (conv) => {
    const speechText = await countLots();
    conv.ask(speechText);
  });

  bot.intent('BusiestLots', async (conv) => {
    const speechText = await getBusiestLots();
    conv.ask(speechText);
  });
};

module.exports = registerHandlers;
