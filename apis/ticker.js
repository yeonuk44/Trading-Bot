const request = require("request");

function getCandlesInfo() {
  const options = {
    method: "GET",
    url: "https://api.upbit.com/v1/candles/days?count=1&market=KRW-BTC",
    headers: { accept: "application/json" },
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
}

module.exports = {
  getCandlesInfo,
};
