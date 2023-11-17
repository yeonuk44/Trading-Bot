const request = require("request");
const technicalBollingerBand = require("../technicals/bb");
const tradingToken = require("../constant");

function getDailyCandlesInfo() {
  const options = {
    method: "GET",
    url: `https://api.upbit.com/v1/candles/days?count=23&market=${tradingToken.TRADING_TOKEN.krw}-${tradingToken.TRADING_TOKEN.mainToken}`,
    headers: { accept: "application/json" },
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        try {
          const responseBody = JSON.parse(body);
          const tradePrices = responseBody.map((candle) => candle.trade_price);
          const dailyBBValue = technicalBollingerBand.bb(tradePrices);
          resolve(dailyBBValue);
        } catch (parseError) {
          reject(parseError);
        }
      }
    });
  });
}

function getMinuteCandleInfo() {
  const options = {
    method: "GET",

    url: `https://api.upbit.com/v1/candles/minutes/1?market=${tradingToken.TRADING_TOKEN.krw}-${tradingToken.TRADING_TOKEN.mainToken}&count=1`,
    headers: { accept: "application/json" },
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        try {
          const responseBody = JSON.parse(body);
          resolve(
            responseBody.map((candle) => ({
              price: candle.trade_price,
              time: candle.candle_date_time_kst,
            }))
          );
        } catch (parseError) {
          reject(parseError);
        }
      }
    });
  });
}

module.exports = {
  getDailyCandlesInfo,
  getMinuteCandleInfo,
};
