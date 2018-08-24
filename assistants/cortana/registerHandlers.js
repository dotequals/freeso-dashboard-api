const {
  helpText,
  welcomeText,
} = require('../shared/appText');
const {
  countLots,
  countSims,
  getBusiestLots,
} = require('../shared/fulfillments');

const handlers = (bot) => {
  bot.dialog('LaunchIntent', (session) => {
    session.send(welcomeText);
    session.endDialog();
  })
    .triggerAction({
      matches: 'Welcome',
    });

  bot.dialog('MICROSOFT.HelpIntent', (session) => {
    console.log('That\'s a match');
    session.send(helpText);
    session.endDialog();
  })
    .triggerAction({
      matches: 'MICROSOFT.HelpIntent',
    });

  bot.dialog('CancelIntent', (session) => {
    session.send('Goodbye!');
    session.endDialog();
  })
    .triggerAction({
      matches: 'Cancel',
    });

  bot.dialog('OnlineSims', async (session) => {
    const speechText = await countSims();
    session.send(speechText);
    session.endDialog();
  })
    .triggerAction({
      matches: 'OnlineSims',
    });

  bot.dialog('OnlineLots', async (session) => {
    const speechText = await countLots();
    session.send(speechText);
    session.endDialog();
  })
    .triggerAction({
      matches: 'OnlineLots',
    });

  bot.dialog('BusiestLots', async (session) => {
    const speechText = await getBusiestLots();
    session.send(speechText);
    session.endDialog();
  })
    .triggerAction({
      matches: 'BusiestLots',
    });
};

module.exports = handlers;
