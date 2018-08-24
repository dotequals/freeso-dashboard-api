const Alexa = require('ask-sdk');

const {
  defaultText,
  errorText,
  helpText,
  skillName,
  welcomeText,
} = require('../shared/appText');

const { countLots, countSims, getBusiestLots } = require('../shared/fulfillments');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(welcomeText)
      .reprompt(welcomeText)
      .withSimpleCard(skillName, welcomeText)
      .getResponse();
  },
};

const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
    && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(defaultText)
      .reprompt(defaultText)
      .withSimpleCard(skillName, defaultText)
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
    const speechText = await countSims();

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(skillName, speechText)
      .getResponse();
  },
};

const OnlineLotsIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
    && handlerInput.requestEnvelope.request.intent.name === 'OnlineLots';
  },
  async handle(handlerInput) {
    const speechText = await countLots();

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(skillName, speechText)
      .getResponse();
  },
};

const BusiestLotsIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
    && handlerInput.requestEnvelope.request.intent.name === 'BusiestLots';
  },
  async handle(handlerInput) {
    const speechText = await getBusiestLots();

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
        FallbackIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedHandler,
        OnlineSimsIntentHandler,
        OnlineLotsIntentHandler,
        BusiestLotsIntentHandler,
      )
      .addErrorHandlers(ErrorHandler)
      .create();
  }
  return skill;
};

module.exports = handlers;
