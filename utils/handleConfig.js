const handleConfig = (modulePath) => {
  try {
    return require(modulePath);
  } catch (error) {
    console.log('ERROR: config.js not found. Please duplicate config.sample.js and rename it to config.js\n');
    process.exit();
  }
};

module.exports = handleConfig;