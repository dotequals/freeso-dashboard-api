const isIntentWithName = (intent, handlerInput) => {
  return handlerInput.requestEnvelope.request.type === 'IntentRequest'
    &&  handlerInput.requestEnvelope.request.intent.name === intent;
};

module.exports = {
  isIntentWithName,
};