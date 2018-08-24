const fetch = require('isomorphic-fetch');

const fetchApi = async () => {
  try {
    const response = await fetch('https://api.thecode.house/userapi/city/001/city.json');
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      error: 'Something went wrong. The FreeSO API may be unavailable.',
    };
  }
};

const fetchNewApi = async () => {
  try {
    const response = await fetch('https://api.thecode.house/api/v2/city/1');
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      error: 'Something went wrong. The FreeSO API may be unavailable.',
    };
  }
};

const countSims = async () => {
  const data = await fetchApi();

  if (!data.error) {
    const { onlineCount } = data;
    const population = onlineCount
      .reduce((accumulator, currentValue) => accumulator + currentValue);
    return `There are ${population} sim${population !== 1 ? 's' : ''} online.`;
  }

  return data.error;
};

const countLots = async () => {
  const data = await fetchApi();

  if (!data.error) {
    const { activeLots } = data;
    const lotCount = activeLots.length;
    return `There are ${lotCount} lot${lotCount !== 1 ? 's' : ''} online.`;
  }

  return data.error;
};

const getBusiestLots = async () => {
  const data = await fetchNewApi();

  if (!data.error) {
    let currentCount = 0;
    let lotArr = [];
    const { lots, online } = data;
    const onlineArr = Object.keys(online);
    if (onlineArr && onlineArr.length > 0) {
      onlineArr.forEach((lotId) => {
        const lotPopulation = online[lotId];
        if (lotPopulation > currentCount) {
          lotArr = [lotId];
          currentCount = lotPopulation;
        } else if (lotPopulation === currentCount) {
          lotArr.push(lotId);
        }
      });

      if (lotArr.length === 1) {
        return `The busiest lot is ${lots[lotArr[0]]}. There are ${currentCount} sim${currentCount !== 1 ? 's' : ''} on this property.`;
      }
      let lotNames = '';
      lotArr.forEach((lotId, index, arr) => {
        if (index === arr.length - 1) {
          lotNames += 'and ';
        }
        lotNames += `${lots[lotId]}, `;
      });
      return `The busiest lots are ${lotNames}. They each have ${currentCount} sim${currentCount !== 1 ? 's' : ''} on their property.`;
    }
    return 'There are no lots online.';
  }

  return data.error;
};

module.exports = {
  countLots,
  countSims,
  fetchApi,
  getBusiestLots,
};
