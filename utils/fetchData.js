/*
 * Download a fresh copy of the API every ten seconds and transform it
 * Original:
 * {
 *   names: [String],
 *   reservedLots: [Number],
 *   activeLots: [Number],
 *   onlineCount: [Number],
 * }
 *
 * Into:
 * {
 *   lots: {
 *     reservedLots[index]: names[index]
 *   },
 *   online: {
 *    activeLots[index2]: onlineCount[index2],
 *   }
 * }
 */

const fs = require('fs');
const fetch = require('isomorphic-fetch');

const deepCopy = require('./deepCopy');
const handleConfig = require('./handleConfig');

const { server } = handleConfig('../config');

const apiSkeleton = {
  names: [],
  reservedLots: [],
  activeLots: [],
  onlineCount: [],
};

const modifiedApiSkeleton = {
  lots: {},
  online: {},
};

const massageData = (data) => {
  const {
    activeLots,
    names,
    onlineCount,
    reservedLots,
  } = data;
  const niceData = deepCopy(modifiedApiSkeleton);

  for (let index = 0; index < reservedLots.length; index += 1) {
    const lotKey = reservedLots[index];
    const lotName = names[index];
    niceData.lots[lotKey] = lotName;

    if (index < activeLots.length) {
      const onlineLotKey = activeLots[index];
      const lotPopulation = onlineCount[index];
      niceData.online[onlineLotKey] = lotPopulation;
    }
  }

  if (data.error) {
    niceData.error = data.error;
  }

  return niceData;
};

const writeData = (api, modifiedApi) => {
  fs.stat('./data/', (error) => {
    if (error) {
      fs.mkdirSync('./data/');
    }

    fs.writeFileSync('./data/city.json', JSON.stringify(api));
    fs.writeFileSync('./data/cityV2.json', JSON.stringify(modifiedApi));
  });
};

const fetchData = async () => {
  let data;

  try {
    const response = await fetch(`${server}/userapi/city/001/city.json`);
    data = await response.json();
  } catch (error) {
    // The only time this should fail is when the API isn't available and we fetch a 5xx page
    data = deepCopy(apiSkeleton);
    data.error = 'The FreeSO API is unavailable.';
  }

  const formattedData = await massageData(deepCopy(data));
  await writeData(data, formattedData);
};

const scheduleFetching = () => {
  // Do this first so that data is ready shortly after starting
  fetchData();

  // Continue fetching every ten seconds
  const timeoutInMS = 1e4;
  const timerId = setInterval(() => {
    fetchData();
  }, timeoutInMS);

  return timerId;
};

module.exports = {
  scheduleFetching,
};
