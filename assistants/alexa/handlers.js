const Alexa = require('ask-sdk');

const { errorText, helpText, skillName } = require('./appText');
const { isIntentWIthName } = require('./helpers');

const { countOnline } = require('../shared/fulfillments');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to FreeSO Dashboard. You can ask me how many sims are online.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(skillName, speechText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(helpText)
      .reprompt(helpText)
      .withSimpleCard(skillName, helpText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
      || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handler(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(skillName, speechText)
      .getResponse();
  },
};

const SessionEndedHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    // Can't send speech here, but useful for cleaning up after requests
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handler(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak(errorText)
      .reprompt(errorText)
      .getResponse();
  },
};

const OnlineSimsIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'OnlineSims';
  },
  async handle(handlerInput) {
    const speechText = await countOnline();

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(skillName, speechText)
      .getResponse();
  },
};

let skill;

const handlers = () => {
  if (!skill) {
   skill = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
      LaunchRequestHandler,
      HelpIntentHandler,
      CancelAndStopIntentHandler,
      SessionEndedHandler,
      OnlineSimsIntentHandler
    )
    .addErrorHandlers(ErrorHandler)
    .create();
  }
  return skill;
}

module.exports = handlers;