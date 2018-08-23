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

const countOnline = async () => {
  const data = await fetchApi();

  if (!data.error) {
    const population = data.onlineCount.reduce((accumulator, currentValue) => accumulator + currentValue);
    return `There are ${population} sim${population !== 1 ? 's' : ''} online.`;
  }

  return data.error;
};

module.exports = {
  fetchApi,
  countOnline,
};