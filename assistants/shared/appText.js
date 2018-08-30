const helpText = 'You can ask me: "How many sims are online?", "How many lots are online?" and "Where is everybody?"';
const skillName = 'FreeSO Dashboard';

const appText = {
  defaultText: `Sorry, I don't know how to help with that. ${helpText}`,
  errorText: 'Sorry, I can\'t understand the command. Please say it again.',
  helpText,
  skillName,
  welcomeText: `Welcome to ${skillName}. ${helpText}`,
};

module.exports = appText;
